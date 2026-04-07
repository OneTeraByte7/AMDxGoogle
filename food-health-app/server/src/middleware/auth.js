// src/middleware/auth.js — Auth-free dev mode (always passes)
/**
 * Attaches a static demo user to every request.
 * Replace this with real Firebase token verification when deploying to production.
 */
function verifyFirebaseToken(req, _res, next) {
    req.user = { uid: 'demo-user', email: 'demo@nutrivita.app', name: 'Demo User' };
    return next();
}

module.exports = verifyFirebaseToken;
