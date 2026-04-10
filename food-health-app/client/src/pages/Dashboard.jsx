// src/pages/Dashboard.jsx — Main dashboard page
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CalorieProgress from '../components/dashboard/CalorieProgress';
import MacroChart from '../components/dashboard/MacroChart';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import WaterTracker from '../components/dashboard/WaterTracker';
import NearbyMap from '../components/maps/NearbyMap';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.98 },
};

export default function Dashboard() {
    const { profile } = useAuth();
    const [todayLogs, setTodayLogs] = useState([]);
    const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/api/auth/summary');
                setTodayLogs(res.data.todayLogs || []);
                if (res.data.todayTotals) setTodayTotals(res.data.todayTotals);
                setWeeklyData(res.data.weekly || []);
            } catch {
                // Errors handled by api.js interceptor
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [today]);

    // Compute aggregated totals (prefer server-provided totals when available)
    const totals = todayTotals.calories > 0 ? todayTotals : todayLogs.reduce(
        (acc, log) => {
            acc.calories += log.calories || 0;
            acc.protein += log.protein || 0;
            acc.carbs += log.carbs || 0;
            acc.fat += log.fat || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const dailyTarget = profile?.dailyCalorieTarget || 2000;

    if (loading) return <Loader fullscreen />;

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-background flex flex-col"
        >
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-text-primary">
                        Good {getTimeOfDay()},{' '}
                        <span className="gradient-text">{profile?.displayName?.split(' ')[0] || 'friend'}</span> 👋
                    </h1>
                    <p className="text-text-secondary mt-1">Here's your health snapshot for today.</p>
                </div>

                {/* Stats grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Calories', val: totals.calories.toLocaleString(), unit: 'kcal', icon: '🔥', color: 'text-primary' },
                        { label: 'Protein', val: totals.protein.toFixed(1), unit: 'g', icon: '💪', color: 'text-success' },
                        { label: 'Carbs', val: totals.carbs.toFixed(1), unit: 'g', icon: '🌾', color: 'text-warning' },
                        { label: 'Fat', val: totals.fat.toFixed(1), unit: 'g', icon: '🥑', color: 'text-gold' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="glass-card p-5"
                            role="region"
                            aria-label={`${stat.label}: ${stat.val} ${stat.unit}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-text-secondary text-sm">{stat.label}</span>
                            </div>
                            <p className={`text-3xl font-bold font-playfair ${stat.color}`}>
                                {stat.val}<span className="text-sm text-text-secondary ml-1 font-poppins font-normal">{stat.unit}</span>
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <CalorieProgress consumed={totals.calories} target={dailyTarget} />
                    </div>
                    <WaterTracker />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <MacroChart protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
                    <WeeklyTrend data={weeklyData} dailyTarget={dailyTarget} />
                </div>

                {/* Map section */}
                <div className="glass-card p-6">
                    <h2 className="font-playfair text-2xl font-bold text-text-primary mb-4">
                        🗺️ Healthy Stores Near You
                    </h2>
                    <NearbyMap />
                </div>
            </main>
            <Footer />
        </motion.div>
    );
}

function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}
