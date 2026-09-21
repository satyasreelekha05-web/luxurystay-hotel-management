import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => API.put(`/auth/reset-password/${token}`, data);

// Room APIs
export const getRooms = (params) => API.get('/rooms', { params });
export const getRoomById = (id) => API.get(`/rooms/${id}`);
export const createRoom = (data) => API.post('/rooms', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);
export const checkAvailability = (params) => API.get('/rooms/check-availability', { params });

// Booking APIs
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/my-bookings');
export const getAllBookings = (params) => API.get('/bookings', { params });
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);
export const createPaymentIntent = (data) => API.post('/bookings/payment-intent', data);
export const confirmPayment = (data) => API.post('/bookings/confirm-payment', data);
export const getBookingStats = () => API.get('/bookings/stats');

// User APIs
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/users/${id}/role`, data);

export default API;
