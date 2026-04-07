// src/middleware/errorHandler.js — Global Express error handler
const config = require('../config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';

    if (config.nodeEnv !== 'test') {
        console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode}: ${message}`);
        if (config.nodeEnv !== 'production') console.error(err.stack);
    }

    return res.status(statusCode).json({
        error: { message, code },
    });
}

module.exports = errorHandler;
