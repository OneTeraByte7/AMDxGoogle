// src/components/common/Loader.jsx
import { motion } from 'framer-motion';

export default function Loader({ fullscreen = false }) {
    const Wrapper = fullscreen
        ? ({ children }) => (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
                {children}
            </div>
        )
        : ({ children }) => <div className="flex items-center justify-center py-12">{children}</div>;

    return (
        <Wrapper>
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    className="w-14 h-14 rounded-full border-4 border-surface-2 border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    role="status"
                    aria-label="Loading"
                />
                <motion.p
                    className="text-text-secondary text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Loading…
                </motion.p>
            </div>
        </Wrapper>
    );
}
