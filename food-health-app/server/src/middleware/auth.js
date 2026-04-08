// src/middleware/auth.js — Dev mode: attach a static demo user to every request
/**
 * Attaches a static demo user to every request.
 * In production, replace this with a proper token verification middleware.
 */
function attachDemoUser(req, _res, next) {
    req.user = { uid: 'demo-user', email: 'demo@nutrivita.app', name: 'Demo User' };
    return next();
}

module.exports = attachDemoUser;
