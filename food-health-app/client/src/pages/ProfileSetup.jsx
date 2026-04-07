// src/pages/ProfileSetup.jsx — Collect user profile on first login
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Lifestyle', 'Goals'];

const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', desc: '1–3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', desc: '3–5 days/week' },
    { value: 'active', label: 'Active', desc: '6–7 days/week' },
    { value: 'very_active', label: 'Very Active', desc: 'Hard exercise daily' },
];

const dietOptions = [
    { value: 'omnivore', label: '🍖 Omnivore', desc: 'Eats everything' },
    { value: 'vegetarian', label: '🥕 Vegetarian', desc: 'No meat/fish' },
    { value: 'vegan', label: '🌱 Vegan', desc: 'No animal products' },
    { value: 'keto', label: '🥑 Keto', desc: 'Low carb, high fat' },
];

const goalOptions = [
    { value: 'lose_weight', label: '⚖️ Lose Weight', desc: '-500 kcal deficit' },
    { value: 'maintain', label: '⚡ Maintain', desc: 'Stay at current weight' },
    { value: 'gain_muscle', label: '💪 Gain Muscle', desc: '+300 kcal surplus' },
];

export default function ProfileSetup() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        displayName: user?.displayName || '',
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activityLevel: '',
        dietaryPreference: '',
        healthGoal: '',
    });

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function nextStep() {
        setStep((s) => Math.min(s + 1, steps.length - 1));
    }
    function prevStep() {
        setStep((s) => Math.max(s - 1, 0));
    }

    async function handleSubmit() {
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                age: parseInt(form.age, 10),
                weight: parseFloat(form.weight),
                height: parseFloat(form.height),
            };
            const { data } = await api.post('/api/auth/profile', payload);
            updateProfile(data.profile);
            toast.success('Profile saved! Welcome to NutriVita 🎉');
            navigate('/dashboard');
        } catch {
            toast.error('Failed to save profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-background flex items-center justify-center px-4 py-16"
        >
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-playfair text-4xl font-bold mb-2">
                        Let's set up your <span className="gradient-text">profile</span>
                    </h1>
                    <p className="text-text-secondary">We'll calculate your personalised calorie target.</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-3 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemax={steps.length}>
                    {steps.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary'
                                }`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-12 h-0.5 ${i < step ? 'bg-primary' : 'bg-surface-2'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form card */}
                <div className="glass-card p-8">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="font-poppins font-semibold text-xl mb-6 text-text-primary">{steps[step]}</h2>

                        {/* Step 0: Personal Info */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="displayName" className="block text-sm text-text-secondary mb-1">Name</label>
                                    <input id="displayName" value={form.displayName} onChange={(e) => handleChange('displayName', e.target.value)}
                                        className="input-field" placeholder="Your name" />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm text-text-secondary mb-1">Age</label>
                                    <input id="age" type="number" value={form.age} onChange={(e) => handleChange('age', e.target.value)}
                                        className="input-field" placeholder="e.g. 28" min="10" max="120" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="weight" className="block text-sm text-text-secondary mb-1">Weight (kg)</label>
                                        <input id="weight" type="number" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)}
                                            className="input-field" placeholder="e.g. 70" />
                                    </div>
                                    <div>
                                        <label htmlFor="height" className="block text-sm text-text-secondary mb-1">Height (cm)</label>
                                        <input id="height" type="number" value={form.height} onChange={(e) => handleChange('height', e.target.value)}
                                            className="input-field" placeholder="e.g. 175" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">Gender</label>
                                    <div className="flex gap-3">
                                        {['male', 'female', 'other'].map((g) => (
                                            <button key={g} onClick={() => handleChange('gender', g)}
                                                className={`flex-1 py-2 rounded-xl text-sm capitalize font-medium transition ${form.gender === g ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary hover:bg-white/10'
                                                    }`}
                                                aria-pressed={form.gender === g}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Lifestyle */}
                        {step === 1 && (
                            <div className="space-y-3">
                                <p className="text-sm text-text-secondary mb-4">How active are you on a typical week?</p>
                                {activityOptions.map((opt) => (
                                    <button key={opt.value} onClick={() => handleChange('activityLevel', opt.value)}
                                        className={`w-full flex items-start gap-4 p-4 rounded-xl border transition text-left ${form.activityLevel === opt.value
                                                ? 'border-primary bg-primary/10'
                                                : 'border-white/10 bg-surface-2 hover:border-primary/40'
                                            }`}
                                        aria-pressed={form.activityLevel === opt.value}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">{opt.label}</p>
                                            <p className="text-xs text-text-secondary">{opt.desc}</p>
                                        </div>
                                        {form.activityLevel === opt.value && <span className="text-primary text-lg">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Goals */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-text-secondary mb-3">Dietary preference</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {dietOptions.map((opt) => (
                                            <button key={opt.value} onClick={() => handleChange('dietaryPreference', opt.value)}
                                                className={`p-3 rounded-xl border text-left transition ${form.dietaryPreference === opt.value
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-white/10 bg-surface-2 hover:border-primary/40'
                                                    }`}
                                                aria-pressed={form.dietaryPreference === opt.value}
                                            >
                                                <p className="text-sm font-medium">{opt.label}</p>
                                                <p className="text-xs text-text-secondary">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary mb-3">Health goal</p>
                                    <div className="space-y-2">
                                        {goalOptions.map((opt) => (
                                            <button key={opt.value} onClick={() => handleChange('healthGoal', opt.value)}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${form.healthGoal === opt.value
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-white/10 bg-surface-2 hover:border-primary/40'
                                                    }`}
                                                aria-pressed={form.healthGoal === opt.value}
                                            >
                                                <div>
                                                    <p className="font-medium text-text-primary">{opt.label}</p>
                                                    <p className="text-xs text-text-secondary">{opt.desc}</p>
                                                </div>
                                                {form.healthGoal === opt.value && <span className="text-primary">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8 gap-4">
                        {step > 0 && (
                            <button onClick={prevStep} className="flex-1 py-3 rounded-xl border border-white/20 text-text-secondary hover:border-primary/40 transition">
                                ← Back
                            </button>
                        )}
                        {step < steps.length - 1 ? (
                            <button onClick={nextStep} className="flex-1 btn-primary">
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !form.dietaryPreference || !form.healthGoal}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-disabled={submitting}
                            >
                                {submitting ? 'Saving...' : '🚀 Complete Setup'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.main>
    );
}
