// src/App.jsx — Root router with AnimatePresence for page transitions
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Assistant from './pages/Assistant';
import ProfileSetup from './pages/ProfileSetup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route
                    path="/setup"
                    element={
                        <ProtectedRoute>
                            <ProfileSetup />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requireProfile>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/log"
                    element={
                        <ProtectedRoute requireProfile>
                            <FoodLog />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/assistant"
                    element={
                        <ProtectedRoute requireProfile>
                            <Assistant />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    const { authLoading } = useAuth();
    if (authLoading) return <Loader fullscreen />;

    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}
