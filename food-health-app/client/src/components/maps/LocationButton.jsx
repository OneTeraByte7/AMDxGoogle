// src/components/maps/LocationButton.jsx
import { motion } from 'framer-motion';

export default function LocationButton({ onLocate, loading }) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLocate}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
            aria-label="Find my location and search nearby health stores"
            aria-busy={loading}
        >
            {loading ? (
                <>
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >⏳</motion.span>
                    Locating…
                </>
            ) : (
                <>📍 Find Stores Near Me</>
            )}
        </motion.button>
    );
}
