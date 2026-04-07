// src/pages/Landing.jsx — Public landing page
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
    { icon: '🍽️', title: 'Food Logging', desc: 'Track every meal with accurate nutrition data from Edamam.' },
    { icon: '📊', title: 'Smart Dashboard', desc: 'Visualise calories, macros, and weekly trends at a glance.' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Context-aware suggestions tailored to your goals and remaining budget.' },
    { icon: '🗺️', title: 'Nearby Stores', desc: 'Find local health food stores and farmers markets on a live map.' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleCTA() {
        if (user) {
            navigate('/dashboard');
        } else {
            await signInWithGoogle();
        }
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-background"
        >
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="relative overflow-hidden min-h-screen flex items-center">
                {/* Background gradient blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-left"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-sm text-primary font-medium">Your Personal Health Companion</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="font-playfair text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            Eat Smart.{' '}
                            <span className="gradient-text">Live Well.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-text-secondary text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                            Track nutrition, get personalised meal suggestions powered by intelligent context-aware logic, and explore healthy food stores near you.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleCTA}
                                className="btn-primary flex items-center justify-center gap-3 text-base"
                                aria-label="Sign in with Google to get started"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {user ? 'Go to Dashboard' : 'Sign in with Google'}
                            </button>
                            <a
                                href="#features"
                                className="btn-gold flex items-center justify-center gap-2 text-base"
                            >
                                ✨ See Features
                            </a>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-10 flex items-center gap-6 text-sm text-text-secondary">
                            <div className="flex items-center gap-1.5"><span className="text-success">✓</span> Free to use</div>
                            <div className="flex items-center gap-1.5"><span className="text-success">✓</span> No credit card</div>
                            <div className="flex items-center gap-1.5"><span className="text-success">✓</span> Privacy first</div>
                        </motion.div>
                    </motion.div>

                    {/* Right — floating dashboard preview card */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden lg:block"
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="glass-card p-6 max-w-sm mx-auto"
                        >
                            <h3 className="font-poppins font-semibold text-text-primary mb-4 text-sm">Today's Summary</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                                        <span>Calories</span><span>1,840 / 2,200 kcal</span>
                                    </div>
                                    <div className="progress-track h-2">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: '83%' }}
                                            transition={{ duration: 1.5, delay: 0.8 }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {[{ label: 'Protein', val: '142g', color: 'text-success' }, { label: 'Carbs', val: '210g', color: 'text-warning' }, { label: 'Fat', val: '58g', color: 'text-primary-light' }].map((m) => (
                                        <div key={m.label} className="bg-surface-2 rounded-xl p-3 text-center">
                                            <p className={`font-bold ${m.color}`}>{m.val}</p>
                                            <p className="text-xs text-text-secondary mt-0.5">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-surface-2 rounded-xl p-3 mt-2">
                                    <span>💧</span>
                                    <div className="flex-1">
                                        <p className="text-xs text-text-secondary">Water Intake</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className={`w-4 h-4 rounded-full border ${i < 6 ? 'bg-primary border-primary' : 'border-white/20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────── */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-4">
                            Everything you need to{' '}
                            <span className="gradient-text">thrive</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            A complete health toolkit in one beautifully designed app.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6, boxShadow: '0 0 30px rgba(108,99,255,0.2)' }}
                                className="glass-card p-6 cursor-default"
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="font-poppins font-semibold text-text-primary mb-2">{f.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center glass-card p-12">
                    <h2 className="font-playfair text-4xl font-bold mb-4">Ready to transform your health?</h2>
                    <p className="text-text-secondary text-lg mb-8">Join thousands of users who are eating smarter every day.</p>
                    <button onClick={handleCTA} className="btn-primary text-lg px-10 py-4">
                        🚀 Get Started Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 text-center text-text-secondary text-sm">
                © {new Date().getFullYear()} NutriVita — Built with ❤️ for your wellbeing.
            </footer>
        </motion.main>
    );
}
