// src/app.js — Express application setup
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const logsRoutes = require('./routes/logs');
const assistantRoutes = require('./routes/assistant');
const placesRoutes = require('./routes/places');

const app = express();

// ─── Security middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: config.clientOrigin,
    credentials: true,
}));

// ─── Rate limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { message: 'Too many requests, please try again later.', code: 'RATE_LIMIT' } },
});
app.use('/api/', limiter);

// ─── Body parsing & logging ─────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv !== 'test') app.use(morgan('dev'));

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/places', placesRoutes);

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: { message: 'Route not found', code: 'NOT_FOUND' } }));

// ─── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
