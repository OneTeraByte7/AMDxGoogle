// src/components/foodlog/LogEntry.jsx — Single log entry row with edit/delete
import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MEAL_ICONS = { breakfast: '☀️', lunch: '🌤️', dinner: '🌙', snack: '🍎' };

export default function LogEntry({ log, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [grams, setGrams] = useState(String(log.grams));
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleSave() {
        if (!grams || parseFloat(grams) <= 0) return;
        setSaving(true);
        try {
            const { data } = await api.put(`/api/logs/${log.id}`, { grams: parseFloat(grams) });
            onUpdate(data.log);
            setEditing(false);
            toast.success('Entry updated!');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await api.delete(`/api/logs/${log.id}`);
            onDelete(log.id);
            toast.success('Entry removed.');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-start gap-3 p-4 bg-surface-2 rounded-xl border border-white/5 hover:border-primary/20 transition group"
        >
            <span className="text-xl mt-0.5">{MEAL_ICONS[log.mealType] || '🍽️'}</span>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{log.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                    {log.grams}g — {log.calories} kcal | P:{log.protein?.toFixed(1)}g C:{log.carbs?.toFixed(1)}g F:{log.fat?.toFixed(1)}g
                </p>

                {editing && (
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="number"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                            className="input-field text-sm py-1 w-24"
                            aria-label="Edit portion grams"
                        />
                        <span className="text-xs text-text-secondary">grams</span>
                        <button onClick={handleSave} disabled={saving} className="text-xs btn-primary py-1 px-3">
                            {saving ? '...' : 'Save'}
                        </button>
                        <button onClick={() => setEditing(false)} className="text-xs text-text-secondary hover:text-text-primary px-2">
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="p-1.5 rounded-lg hover:bg-primary/20 text-text-secondary hover:text-primary text-sm transition"
                        aria-label={`Edit ${log.label}`}
                    >
                        ✏️
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 rounded-lg hover:bg-danger/20 text-text-secondary hover:text-danger text-sm transition"
                    aria-label={`Delete ${log.label}`}
                >
                    🗑️
                </button>
            </div>
        </motion.div>
    );
}
