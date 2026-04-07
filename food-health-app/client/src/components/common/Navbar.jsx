// src/components/common/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/log', label: 'Food Log', icon: '🍽️' },
    { to: '/assistant', label: 'Assistant', icon: '🤖' },
];

export default function Navbar() {
    const { user, logOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        await logOut();
        navigate('/');
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-glass border-b border-white/10"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/dashboard" className="flex items-center gap-2 group">
                        <span className="text-2xl">🥗</span>
                        <span className="font-playfair font-bold text-xl gradient-text">NutriVita</span>
                    </NavLink>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`
                                }
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-white/10 transition text-text-secondary hover:text-text-primary"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* User avatar + dropdown */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen((o) => !o)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition"
                                    aria-label="User menu"
                                    aria-expanded={menuOpen}
                                >
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="w-8 h-8 rounded-full border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                                            {(user.displayName || 'U')[0]}
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="absolute right-0 mt-2 w-48 glass-card py-2 shadow-xl"
                                        >
                                            <p className="px-4 py-2 text-xs text-text-secondary truncate border-b border-white/10 mb-1">
                                                {user.email}
                                            </p>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition"
                                            >
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle mobile menu"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile nav menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-surface border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-3 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/20 text-primary' : 'text-text-secondary'
                                        }`
                                    }
                                >
                                    {link.icon} {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
