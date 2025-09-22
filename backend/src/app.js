import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);

// Base Route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the SIH Project Backend 🚀" });
});

export default app;