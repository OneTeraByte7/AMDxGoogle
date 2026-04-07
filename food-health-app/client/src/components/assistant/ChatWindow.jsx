// src/components/assistant/ChatWindow.jsx — Scrollable message list + input
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import QuickSuggestions from './QuickSuggestions';
import api from '../../services/api';

const WELCOME = {
    role: 'assistant',
    content: "Hi! I'm your NutriVita assistant. 🥗\n\nI can suggest meals based on your remaining calorie budget, warn you about unhealthy choices, and answer nutrition questions. Ask me anything!",
    ts: Date.now(),
};

export default function ChatWindow() {
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage(text = input) {
        const msg = text.trim();
        if (!msg) return;

        setShowSuggestions(false);
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: msg, ts: Date.now() }]);
        setLoading(true);

        try {
            const { data } = await api.post('/api/assistant/message', { message: msg });
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, ts: Date.now() }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect to the server. Please try again.", ts: Date.now() }]);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="glass-card flex flex-col h-[600px]" role="region" aria-label="Chat with assistant">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">🤖</div>
                <div>
                    <h3 className="font-semibold text-text-primary">NutriVita Assistant</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-xs text-text-secondary">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite" aria-atomic="false">
                {messages.map((m, i) => (
                    <MessageBubble key={i} message={m} />
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="g…-card px-4 py-3 text-sm flex gap-1.5 items-center text-text-secondary">
                            <motion.span
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            >●</motion.span>
                            <motion.span
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                            >●</motion.span>
                            <motion.span
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                            >●</motion.span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {showSuggestions && <QuickSuggestions onSelect={(t) => sendMessage(t)} />}

            {/* Input bar */}
            <div className="px-4 pb-4 flex items-end gap-3 border-t border-white/10 pt-4">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about nutrition…"
                    rows={1}
                    className="input-field resize-none flex-1 min-h-[44px] max-h-[120px]"
                    aria-label="Type a message"
                    disabled={loading}
                />
                <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="btn-primary px-4 py-2.5 rounded-xl disabled:opacity-40"
                    aria-label="Send message"
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
