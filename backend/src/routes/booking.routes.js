import express from 'express';
import { createBooking, getMyBookings, getBookingById, getAllBookings, updateBooking } from '../controllers/booking.controller';
import protect from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';

const router = express.Router();

// Create a new booking
router.post('/', protect, createBooking);

// Get bookings for logged-in user
router.get('/my-bookings', protect, getMyBookings);

// Admin routes
router.get('/', protect, isAdmin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, isAdmin, updateBooking);

export default router;