// src/components/foodlog/DailyLogList.jsx — Today's log with totals
import { motion, AnimatePresence } from 'framer-motion';
import LogEntry from './LogEntry';

export default function DailyLogList({ logs, onUpdate, onDelete }) {
    const totals = logs.reduce(
        (acc, l) => {
            acc.calories += l.calories || 0;
            acc.protein += l.protein || 0;
            acc.carbs += l.carbs || 0;
            acc.fat += l.fat || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const grouped = mealTypes.reduce((acc, type) => {
        acc[type] = logs.filter((l) => l.mealType === type);
        return acc;
    }, {});

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary text-lg">📋 Today's Log</h3>
                <span className="text-xs text-text-secondary">{logs.length} entries</span>
            </div>

            {logs.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                    <p className="text-4xl mb-3">🍽️</p>
                    <p className="text-sm">No meals logged yet today.</p>
                    <p className="text-xs mt-1">Use the search above to add your first meal!</p>
                </div>
            ) : (
                <>
                    <AnimatePresence>
                        {mealTypes.map((type) =>
                            grouped[type].length > 0 ? (
                                <div key={type} className="mb-4">
                                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </p>
                                    <div className="space-y-2">
                                        {grouped[type].map((log) => (
                                            <LogEntry key={log.id} log={log} onUpdate={onUpdate} onDelete={onDelete} />
                                        ))}
                                    </div>
                                </div>
                            ) : null,
                        )}
                    </AnimatePresence>

                    {/* Daily totals */}
                    <div className="border-t border-white/10 mt-4 pt-4 grid grid-cols-4 gap-3">
                        {[
                            { label: 'Total Calories', val: totals.calories, color: 'text-primary' },
                            { label: 'Protein', val: `${totals.protein.toFixed(1)}g`, color: 'text-success' },
                            { label: 'Carbs', val: `${totals.carbs.toFixed(1)}g`, color: 'text-warning' },
                            { label: 'Fat', val: `${totals.fat.toFixed(1)}g`, color: 'text-gold' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className={`text-lg font-bold font-playfair ${s.color}`}>{s.val}</p>
                                <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
