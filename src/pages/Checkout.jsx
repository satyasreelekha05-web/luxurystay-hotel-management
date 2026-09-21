import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../services/api';
import { showSuccess, showError } from '../utils/toast';
import { format } from 'date-fns';
import { FaHotel, FaCalendar, FaUsers, FaLock } from 'react-icons/fa';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripeEnabled = STRIPE_KEY.startsWith('pk_test_') || STRIPE_KEY.startsWith('pk_live_');
const stripePromise = stripeEnabled ? loadStripe(STRIPE_KEY) : null;

// ── Demo form: NO Stripe hooks — safe to render without <Elements> ────────────
const DemoPaymentForm = ({ booking }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [initError, setInitError] = useState('');

  const totalDisplay = `₹${(booking.totalPrice || 0).toLocaleString('en-IN')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setInitError('');
    try {
      // Step 1: createPaymentIntent marks booking confirmed in demo mode
      await createPaymentIntent({ bookingId: booking._id });
      // Step 2: confirmPayment ensures status=confirmed, paymentStatus=paid
      await confirmPayment({ bookingId: booking._id });
      showSuccess('Booking confirmed! (Demo Mode)');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to confirm booking.';
      setInitError(msg);
      showError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (initError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        ⚠️ {initError}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-primary-900/5 border border-primary-900/10 rounded-xl">
        <div className="w-9 h-9 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <FaLock className="text-white text-xs" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-900">Secure Booking Confirmation</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            This booking system is running in a demonstration environment.<br />
            Your reservation will be confirmed instantly upon completion.
          </p>
        </div>
      </div>

      {/* Reservation details card */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reservation Details</p>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-slate-500">Booking Reference</span>
            <span className="text-sm font-mono font-medium text-primary-900">
              #{booking._id?.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-slate-500">Payment Method</span>
            <span className="text-sm font-medium text-slate-700">Instant Confirmation</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-slate-500">Amount Due</span>
            <span className="text-sm font-bold text-gold">{totalDisplay}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="btn-primary w-full py-4 text-base"
      >
        {processing ? 'Confirming Reservation...' : `Complete Reservation ${totalDisplay}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-slate-400">
        <FaLock className="text-xs" />
        <p className="text-xs">Your reservation is protected and confirmed instantly</p>
      </div>
    </form>
  );
};

// ── Stripe form: uses useStripe/useElements — MUST be inside <Elements> ───────
const StripePaymentForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [initError, setInitError] = useState('');

  useEffect(() => {
    createPaymentIntent({ bookingId: booking._id })
      .then(({ data }) => setClientSecret(data.clientSecret))
      .catch(err => {
        setInitError(err.response?.data?.message || 'Failed to initialize payment.');
        showError('Payment initialization failed.');
      });
  }, []);

  const totalDisplay = `₹${(booking.totalPrice || 0).toLocaleString('en-IN')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (error) {
        showError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await confirmPayment({ bookingId: booking._id });
        showSuccess('Payment successful! Booking confirmed.');
        navigate('/dashboard');
      }
    } catch {
      showError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (initError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        ⚠️ {initError}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <FaLock className="text-slate-400 text-sm" />
          <p className="text-xs text-slate-500 font-medium">Secure Payment · SSL Encrypted</p>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#0f172a',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#94a3b8' }
              },
              invalid: { color: '#ef4444' }
            }
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="btn-primary w-full py-4 text-base"
      >
        {processing ? 'Processing...' : `Pay ${totalDisplay}`}
      </button>
    </form>
  );
};

// ── Checkout page ─────────────────────────────────────────────────────────────
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) navigate('/rooms');
  }, [booking, navigate]);

  if (!booking) return null;

  const roomName     = booking.room?.name     || 'Room';
  const roomCategory = booking.room?.category || '';
  const totalPrice   = booking.totalPrice     || 0;
  const nights = booking.checkInDate && booking.checkOutDate
    ? Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-primary-900 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl font-bold text-white">Complete Your Booking</h1>
          <p className="text-slate-400 text-sm mt-1">Review your details and complete payment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl shadow-card p-7">
            <h2 className="font-semibold text-primary-900 text-xl mb-6">Booking Summary</h2>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaHotel className="text-white text-sm" />
              </div>
              <div>
                <p className="font-semibold text-primary-900">{roomName}</p>
                {roomCategory && <p className="text-slate-400 text-xs">{roomCategory}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCalendar className="text-gold text-sm flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-500 text-sm">Check-in</span>
                  <span className="font-medium text-sm text-primary-900">
                    {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendar className="text-gold text-sm flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-500 text-sm">Check-out</span>
                  <span className="font-medium text-sm text-primary-900">
                    {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUsers className="text-gold text-sm flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-500 text-sm">Guests</span>
                  <span className="font-medium text-sm text-primary-900">{booking.numberOfGuests}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-slate-500 pt-2">
                <span>Duration</span>
                <span className="font-medium text-primary-900">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-5">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-primary-900">Total Amount</p>
                <p className="text-2xl font-bold text-gold">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <p className="text-slate-400 text-xs mt-1">Inclusive of all taxes</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-card p-7">
            <h2 className="font-semibold text-primary-900 text-xl mb-6">Payment Details</h2>
            {stripeEnabled ? (
              <Elements stripe={stripePromise}>
                <StripePaymentForm booking={booking} />
              </Elements>
            ) : (
              <DemoPaymentForm booking={booking} />
            )}
            <p className="text-center text-slate-400 text-xs mt-4">
              Free cancellation up to 24 hours before check-in
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
