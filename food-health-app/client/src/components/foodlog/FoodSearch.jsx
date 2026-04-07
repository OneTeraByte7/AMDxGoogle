// src/components/foodlog/FoodSearch.jsx — Debounced food search with results dropdown
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function FoodSearch({ onAdd }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState(null);
    const [grams, setGrams] = useState('100');
    const [mealType, setMealType] = useState('snack');
    const [adding, setAdding] = useState(false);
    const debounceRef = useRef(null);

    const handleSearch = useCallback((value) => {
        setQuery(value);
        clearTimeout(debounceRef.current);
        if (!value.trim()) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const { data } = await api.get('/api/food/search', { params: { q: value } });
                setResults(data.foods || []);
            } finally {
                setSearching(false);
            }
        }, 450);
    }, []);

    function selectFood(food) {
        setSelected(food);
        setQuery(food.label);
        setResults([]);
    }

    async function handleAdd() {
        if (!selected || !grams || parseFloat(grams) <= 0) {
            toast.error('Please select a food and enter a valid portion size.');
            return;
        }
        setAdding(true);
        const today = new Date().toISOString().split('T')[0];
        try {
            await api.post('/api/logs', {
                foodId: selected.foodId,
                label: selected.label,
                grams: parseFloat(grams),
                mealType,
                date: today,
                nutrients: selected.nutrients,
            });
            toast.success(`${selected.label} added to your log! 🎉`);
            setSelected(null);
            setQuery('');
            setGrams('100');
            if (onAdd) onAdd();
        } catch {
            // Error handled by interceptor
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="glass-card p-6">
            <h3 className="font-semibold text-text-primary text-lg mb-4">🔍 Search Food</h3>

            {/* Search input */}
            <div className="relative mb-4">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="e.g. chicken breast, banana..."
                    className="input-field pr-10"
                    aria-label="Search for food"
                    autoComplete="off"
                />
                {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <motion.div
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>
                )}

                {/* Dropdown results */}
                <AnimatePresence>
                    {results.length > 0 && (
                        <motion.ul
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute top-full left-0 right-0 z-20 bg-surface border border-white/10 rounded-xl shadow-xl mt-1 overflow-hidden"
                            role="listbox"
                            aria-label="Food search results"
                        >
                            {results.map((food) => (
                                <li key={food.foodId} role="option" aria-selected={selected?.foodId === food.foodId}>
                                    <button
                                        onClick={() => selectFood(food)}
                                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{food.label}</p>
                                            {food.brand && <p className="text-xs text-text-secondary">{food.brand}</p>}
                                        </div>
                                        <span className="text-xs text-text-secondary">{Math.round(food.nutrients.ENERC_KCAL)} kcal/100g</span>
                                    </button>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {/* Portion + meal type */}
            {selected && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                >
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                        <p className="font-medium text-text-primary text-sm">{selected.label}</p>
                        <p className="text-xs text-text-secondary mt-1">
                            Per 100g: {Math.round(selected.nutrients.ENERC_KCAL)} kcal | P: {selected.nutrients.PROCNT?.toFixed(1)}g | C: {selected.nutrients.CHOCDF?.toFixed(1)}g | F: {selected.nutrients.FAT?.toFixed(1)}g
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="portion-grams" className="block text-xs text-text-secondary mb-1">Portion (grams)</label>
                            <input
                                id="portion-grams"
                                type="number"
                                value={grams}
                                onChange={(e) => setGrams(e.target.value)}
                                className="input-field"
                                min="1"
                                max="5000"
                            />
                        </div>
                        <div>
                            <label htmlFor="meal-type" className="block text-xs text-text-secondary mb-1">Meal type</label>
                            <select
                                id="meal-type"
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="input-field"
                            >
                                {MEAL_TYPES.map((t) => (
                                    <option key={t} value={t} style={{ background: '#1E1E1E' }}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Estimated nutrition preview */}
                    {grams && parseFloat(grams) > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { label: 'Calories', val: Math.round((selected.nutrients.ENERC_KCAL || 0) * parseFloat(grams) / 100) },
                                { label: 'Protein', val: ((selected.nutrients.PROCNT || 0) * parseFloat(grams) / 100).toFixed(1) + 'g' },
                                { label: 'Carbs', val: ((selected.nutrients.CHOCDF || 0) * parseFloat(grams) / 100).toFixed(1) + 'g' },
                                { label: 'Fat', val: ((selected.nutrients.FAT || 0) * parseFloat(grams) / 100).toFixed(1) + 'g' },
                            ].map((n) => (
                                <div key={n.label} className="bg-surface-2 rounded-xl p-2 text-center">
                                    <p className="text-xs text-text-secondary">{n.label}</p>
                                    <p className="text-sm font-semibold text-text-primary mt-0.5">{n.val}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleAdd} disabled={adding} className="btn-primary w-full" aria-busy={adding}>
                        {adding ? 'Adding...' : '+ Add to Log'}
                    </button>
                </motion.div>
            )}
        </div>
    );
}
