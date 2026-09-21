import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import sendEmail from '../utils/sendEmail.js';
import Stripe from 'stripe';

// Guard: only initialise Stripe when a real key is provided.
// A real Stripe secret key always starts with 'sk_test_' or 'sk_live_'.
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripeEnabled = STRIPE_KEY.startsWith('sk_test_') || STRIPE_KEY.startsWith('sk_live_');
const stripe = stripeEnabled ? new Stripe(STRIPE_KEY) : null;

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Normalize incoming dates to midnight UTC to avoid timezone-offset false conflicts
    const newCheckIn  = new Date(checkInDate  + 'T00:00:00.000Z');
    const newCheckOut = new Date(checkOutDate + 'T00:00:00.000Z');

    if (newCheckOut <= newCheckIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Only confirmed (paid) bookings block dates.
    // pending  = payment not completed, must never permanently block a room.
    // cancelled / completed = never block.
    const conflictingBookings = await Booking.find({
      room: roomId,
      status: 'confirmed',
      checkInDate:  { $lt: newCheckOut },
      checkOutDate: { $gt: newCheckIn }
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ message: 'Room not available for selected dates' });
    }

    const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * days;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // ── Demo mode: Stripe key not configured ──────────────────────────────────
    // Returns a fake clientSecret so the frontend checkout flow works for demos.
    // The booking is immediately marked confirmed without real payment processing.
    if (!stripeEnabled) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();
      return res.json({ clientSecret: 'demo_secret_' + booking._id, demo: true });
    }

    // ── Real Stripe payment ───────────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: 'inr',
      metadata: { bookingId: booking._id.toString() }
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('room').populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // Send confirmation email — non-fatal if email fails
    try {
      const message = `
        <h1>Booking Confirmation</h1>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking has been confirmed!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li>Room: ${booking.room.name}</li>
          <li>Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}</li>
          <li>Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
          <li>Guests: ${booking.numberOfGuests}</li>
          <li>Total Price: ₹${booking.totalPrice}</li>
        </ul>
        <p>Thank you for choosing LuxuryStay Hotel!</p>
      `;
      await sendEmail({ email: booking.user.email, subject: 'Booking Confirmation', message });
    } catch (_) {
      // Email failure should not fail the payment confirmation
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const count = await Booking.countDocuments(query);
    res.json({ bookings, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    res.json({ totalBookings, confirmedBookings, pendingBookings, cancelledBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
