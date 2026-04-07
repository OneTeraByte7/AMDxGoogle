// src/pages/Assistant.jsx
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatWindow from '../components/assistant/ChatWindow';

export default function Assistant() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-background flex flex-col"
        >
            <Navbar />
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="font-playfair text-3xl font-bold gradient-text">Smart Assistant</h1>
                    <p className="text-text-secondary mt-1">Context-aware nutrition guidance powered by your goals & logs.</p>
                </div>
                <ChatWindow />
            </main>
            <Footer />
        </motion.div>
    );
}
