// server/src/services/firebaseAdmin.js — Static Mock DB entry point
/**
 * This file replaces the Firebase Admin SDK initialization to allow the app
 * to run entirely without cloud credentials. It exports a "db" object
 * that implements a Firestore-compatible API storing data in /server/data/db.json.
 */
const mockDb = require('./mockFirestore');

module.exports = {
    admin: {
        // Basic mocks for anything that might try to use admin.firestore literal
        firestore: () => mockDb,
        auth: () => ({
            verifyIdToken: async () => ({ uid: 'demo-user', email: 'demo@nutrivita.app' }),
        }),
    },
    app: {},
    db: mockDb,
    getAuth: () => ({
        verifyIdToken: async () => ({ uid: 'demo-user', email: 'demo@nutrivita.app' }),
    }),
};
