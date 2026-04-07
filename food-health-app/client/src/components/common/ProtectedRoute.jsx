// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * requireProfile: if true, also redirect to /setup when profile is incomplete.
 */
export default function ProtectedRoute({ children, requireProfile = false }) {
    const { user, profile, authLoading } = useAuth();

    if (authLoading) return <Loader fullscreen />;
    if (!user) return <Navigate to="/" replace />;
    if (requireProfile && !profile?.profileComplete) return <Navigate to="/setup" replace />;

    return children;
}
