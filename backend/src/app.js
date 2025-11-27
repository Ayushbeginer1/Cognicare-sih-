import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import psychocareRoutes from './routes/psychocare.routes.js';
import forumRoutes from './routes/forum.routes.js';
import moderatorRoutes from './routes/moderator.routes.js';
import { errorHandler, notFound } from './middlewares/error.handler.js';
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
app.use('/api/psychocare', psychocareRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/moderator', moderatorRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;