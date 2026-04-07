// src/pages/FoodLog.jsx — Food logging page
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FoodSearch from '../components/foodlog/FoodSearch';
import DailyLogList from '../components/foodlog/DailyLogList';
import Loader from '../components/common/Loader';
import api from '../services/api';

export default function FoodLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    const fetchLogs = useCallback(async () => {
        try {
            const { data } = await api.get(`/api/logs/${today}`);
            setLogs(data.logs || []);
        } finally {
            setLoading(false);
        }
    }, [today]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    function handleUpdate(updatedLog) {
        setLogs((prev) => prev.map((l) => (l.id === updatedLog.id ? updatedLog : l)));
    }

    function handleDelete(logId) {
        setLogs((prev) => prev.filter((l) => l.id !== logId));
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-background flex flex-col"
        >
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="font-playfair text-3xl font-bold gradient-text">Food Log</h1>
                    <p className="text-text-secondary mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {loading ? <Loader /> : (
                    <div className="space-y-6">
                        <FoodSearch onAdd={fetchLogs} />
                        <DailyLogList logs={logs} onUpdate={handleUpdate} onDelete={handleDelete} />
                    </div>
                )}
            </main>
            <Footer />
        </motion.div>
    );
}
