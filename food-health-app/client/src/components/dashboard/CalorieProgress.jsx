// src/components/dashboard/CalorieProgress.jsx
import { motion } from 'framer-motion';

export default function CalorieProgress({ consumed = 0, target = 2000 }) {
    const pct = Math.min(Math.round((consumed / target) * 100), 100);
    const remaining = Math.max(target - consumed, 0);
    const overBudget = consumed > target;

    const barColor = overBudget
        ? 'from-danger to-red-400'
        : pct > 85
            ? 'from-warning to-yellow-400'
            : 'from-primary to-primary-light';

    return (
        <div className="glass-card p-6" role="region" aria-label="Calorie progress">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Calorie Progress</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${overBudget ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                    {overBudget ? 'Over budget' : `${100 - pct}% left`}
                </span>
            </div>

            {/* Big number */}
            <div className="flex items-end gap-2 mb-4">
                <motion.span
                    className="font-playfair text-5xl font-bold text-text-primary"
                    key={consumed}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {consumed.toLocaleString()}
                </motion.span>
                <span className="text-text-secondary text-lg mb-1">/ {target.toLocaleString()} kcal</span>
            </div>

            {/* Progress bar */}
            <div className="progress-track h-3 mb-3" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} role="progressbar">
                <motion.div
                    className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>

            <div className="flex justify-between text-xs text-text-secondary">
                <span>{consumed} consumed</span>
                <span>{remaining} remaining</span>
            </div>
        </div>
    );
}
