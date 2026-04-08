// server/src/services/localDb.js — Local in-repo DB shim (replaces Firebase naming)
// Exports a small interface compatible with controllers: { db, getAuth }
const mockDb = require('./mockFirestore');

module.exports = {
    app: {},
    db: mockDb,
    admin: {
        firestore: () => mockDb,
        auth: () => ({
            verifyIdToken: async () => ({ uid: 'demo-user', email: 'demo@nutrivita.app' }),
        }),
    },
    getAuth: () => ({
        verifyIdToken: async () => ({ uid: 'demo-user', email: 'demo@nutrivita.app' }),
    }),
};
