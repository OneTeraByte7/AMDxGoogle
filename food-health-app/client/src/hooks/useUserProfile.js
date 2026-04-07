// src/hooks/useUserProfile.js — Fetch and cache user profile from backend
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function useUserProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            return;
        }

        setIsLoading(true);
        api.get('/api/auth/profile')
            .then(({ data }) => {
                setProfile(data.profile);
                setError(null);
            })
            .catch((err) => {
                if (err.response?.status !== 404) {
                    setError(err.message);
                }
            })
            .finally(() => setIsLoading(false));
    }, [user]);

    function refreshProfile() {
        if (!user) return;
        setIsLoading(true);
        api.get('/api/auth/profile')
            .then(({ data }) => setProfile(data.profile))
            .finally(() => setIsLoading(false));
    }

    return { profile, isLoading, error, refreshProfile };
}
