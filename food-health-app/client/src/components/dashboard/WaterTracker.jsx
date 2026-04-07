// src/components/dashboard/WaterTracker.jsx — localStorage-backed, no Firebase
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DAILY_GOAL = 8;
const storageKey = () => `water-${new Date().toISOString().split('T')[0]}`;

export default function WaterTracker() {
    const [cups, setCups] = useState(() => {
        try { return parseInt(localStorage.getItem(storageKey()) || '0', 10); }
        catch { return 0; }
    });

    useEffect(() => {
        try { localStorage.setItem(storageKey(), String(cups)); }
        catch { /* ignore */ }
    }, [cups]);

    function addCup() {
        if (cups >= DAILY_GOAL) { toast.success('Daily water goal reached! 🎉'); return; }
        const next = cups + 1;
        setCups(next);
        if (next === DAILY_GOAL) toast.success('Hydration goal complete! 💧');
    }

    function removeCup() {
        if (cups <= 0) return;
        setCups((c) => c - 1);
    }

    return (
        <div className="glass-card p-6" role="region" aria-label="Water intake tracker">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Water Intake</h3>
                <span className="text-xs text-text-secondary">{cups} / {DAILY_GOAL} cups</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4" role="list" aria-label="Water cups">
                {[...Array(DAILY_GOAL)].map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={i < cups ? removeCup : addCup}
                        whileTap={{ scale: 0.9 }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${i < cups ? 'bg-primary/20' : 'bg-surface-2 opacity-40'
                            }`}
                        aria-label={i < cups ? `Remove cup ${i + 1}` : `Add cup ${i + 1}`}
                        role="listitem"
                    >
                        <motion.span key={`${i}-${i < cups}`} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-xl">
                            {i < cups ? '💧' : '🫙'}
                        </motion.span>
                        <span className="text-xs text-text-secondary mt-1">{i + 1}</span>
                    </motion.button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4">
                <button onClick={removeCup} disabled={cups <= 0}
                    className="w-10 h-10 rounded-full bg-surface-2 hover:bg-danger/20 text-text-secondary hover:text-danger transition disabled:opacity-30 text-lg font-bold"
                    aria-label="Decrease water intake">−</button>
                <div className="text-center">
                    <motion.span key={cups} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-bold font-playfair text-primary">{cups}</motion.span>
                    <p className="text-xs text-text-secondary">cups</p>
                </div>
                <button onClick={addCup} disabled={cups >= DAILY_GOAL}
                    className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition disabled:opacity-30 text-lg font-bold"
                    aria-label="Increase water intake">+</button>
            </div>
        </div>
    );
}
