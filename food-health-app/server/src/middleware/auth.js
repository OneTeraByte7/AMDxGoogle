// src/middleware/auth.js — Token verification middleware (supports BYPASS_AUTH)
const { getAuth } = require('../services/localDb');

async function verifyToken(req, res, next) {
    // Bypass mode for quick dev: attach demo user when env var is set
    if (process.env.BYPASS_AUTH === 'true') {
        req.user = { uid: 'demo-user', email: 'demo@nutrivita.app', name: 'Demo User' };
        return next();
    }

    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
    }

    const token = auth.split(' ')[1];
    try {
        const authClient = getAuth();
        const decoded = await authClient.verifyIdToken(token);
        req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || '' };
        return next();
    } catch (err) {
        return res.status(401).json({ error: { message: 'Invalid token', code: 'UNAUTHORIZED' } });
    }
}

module.exports = verifyToken;
