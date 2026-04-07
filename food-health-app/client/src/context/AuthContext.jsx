// src/context/AuthContext.jsx — Static demo user, no Firebase
import { createContext, useContext, useState } from 'react';

const DEMO_USER = {
    uid: 'demo-user',
    email: 'demo@nutrivita.app',
    displayName: 'Demo User',
    photoURL: null,
};

const DEMO_PROFILE = {
    uid: 'demo-user',
    email: 'demo@nutrivita.app',
    displayName: 'Demo User',
    age: 28,
    weight: 75,
    height: 175,
    gender: 'male',
    activityLevel: 'active',
    dietaryPreference: 'omnivore',
    healthGoal: 'maintain',
    dailyCalorieTarget: 2500,
    waterGoal: 8,
    profileComplete: true,
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [profile, setProfile] = useState(DEMO_PROFILE);

    return (
        <AuthContext.Provider
            value={{
                user: DEMO_USER,
                profile,
                authLoading: false,
                profileComplete: true,
                signInWithGoogle: () => { },
                logOut: () => { },
                updateProfile: setProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
