// src/components/assistant/QuickSuggestions.jsx
import { motion } from 'framer-motion';

const SUGGESTIONS = [
    { emoji: '👋', text: 'Hello! How am I doing today?' },
    { emoji: '🍽️', text: 'What should I eat for lunch?' },
    { emoji: '💪', text: 'How can I get more protein?' },
    { emoji: '💧', text: 'Water intake tips?' },
    { emoji: '⚡', text: 'I need more energy — what to eat?' },
    { emoji: '🥗', text: 'Suggest a healthy snack' },
];

export default function QuickSuggestions({ onSelect }) {
    return (
        <div className="px-4 pb-4">
            <p className="text-xs text-text-secondary mb-2 font-medium">Quick suggestions</p>
            <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                    <motion.button
                        key={s.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => onSelect(s.text)}
                        className="flex items-center gap-1.5 text-xs bg-surface-2 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 px-3 py-2 rounded-full transition-all"
                    >
                        {s.emoji} {s.text}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
