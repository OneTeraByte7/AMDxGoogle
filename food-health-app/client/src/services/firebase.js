// src/services/firebase.js — Mock Firebase client SDK
// This file replaces the real Firebase SDK to allow the app to run without any credentials.

export const auth = {
    currentUser: {
        uid: 'demo-user',
        email: 'demo@nutrivita.app',
        displayName: 'Demo User',
        getIdToken: async () => 'demo-token',
    },
    onAuthStateChanged: (callback) => {
        // Immediately trigger with demo user
        callback({
            uid: 'demo-user',
            email: 'demo@nutrivita.app',
            displayName: 'Demo User',
            getIdToken: async () => 'demo-token',
        });
        return () => { }; // Unsubscribe no-op
    },
    signInWithPopup: async () => ({ user: { uid: 'demo-user' } }),
    signOut: async () => { },
};

export const db = {
    // Mock Firestore methods if needed by client components (like WaterTracker used to)
    collection: () => ({
        doc: () => ({
            get: async () => ({ exists: () => false, data: () => ({}) }),
            set: async () => { },
        }),
    }),
};

export const googleProvider = {
    setCustomParameters: () => { },
};

// Mock initializeApp
export const initializeApp = () => ({});

export default {};
