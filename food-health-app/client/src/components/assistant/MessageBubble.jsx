// src/components/assistant/MessageBubble.jsx
import { motion } from 'framer-motion';

// Simple markdown bold renderer: **text** → <strong>
function renderMarkdown(text) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : part,
    );
}

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
                    🤖
                </div>
            )}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${isUser
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'glass-card rounded-bl-sm text-text-primary'
                    }`}
                role="article"
                aria-label={isUser ? 'Your message' : 'Assistant message'}
            >
                {renderMarkdown(message.content)}
                <p className="text-xs opacity-50 mt-1.5 text-right">
                    {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </motion.div>
    );
}
