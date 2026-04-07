// src/config/index.js — Centralised environment config
module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

    firebase: {
        serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
        serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    },

    edamam: {
        appId: process.env.EDAMAM_APP_ID || '',
        appKey: process.env.EDAMAM_APP_KEY || '',
        baseUrl: process.env.EDAMAM_BASE_URL || 'https://api.edamam.com',
    },

    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },

    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
    },
};
