// src/pages/NotFound.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center"
            role="main"
            aria-label="Page not found"
        >
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl mb-6"
            >
                🍃
            </motion.div>
            <h1 className="font-playfair text-6xl font-bold gradient-text mb-4">404</h1>
            <p className="text-xl text-text-secondary mb-8">
                Looks like this page went on a diet and disappeared.
            </p>
            <Link to="/dashboard" className="btn-primary">
                🏠 Back to Dashboard
            </Link>
        </motion.main>
    );
}
