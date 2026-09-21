import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getAllBookings, 
  getBookingById, 
  cancelBooking, 
  updateBookingStatus,
  createPaymentIntent,
  confirmPayment,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.post('/payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/my-bookings', protect, getUserBookings);
router.get('/stats', protect, admin, getBookingStats);
router.get('/', protect, admin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
