import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { errorHandler, notFound } from './utils/error.handler.js';
import { encrypt, decrypt } from "./utils/crypto.js";

const app = express();

// Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;