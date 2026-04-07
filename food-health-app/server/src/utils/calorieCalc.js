// src/utils/calorieCalc.js — BMR and calorie target calculations
/**
 * Mifflin-St Jeor BMR formula.
 * profile: { age, weight (kg), height (cm), gender ('male'|'female') }
 * Returns BMR in kcal/day.
 */
function calculateBMR({ age = 25, weight = 70, height = 170, gender = 'male' }) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'female' ? base - 161 : base + 5;
}

/**
 * Multiply BMR by Harris-Benedict activity factor.
 * activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'active' | 'very_active'
 */
function applyActivityFactor(bmr, activityLevel) {
    const factors = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    const factor = factors[activityLevel] || 1.2;
    return Math.round(bmr * factor);
}

/**
 * Adjust TDEE based on health goal.
 * goal: 'lose_weight' | 'maintain' | 'gain_muscle'
 */
function adjustByGoal(tdee, goal) {
    const adjustments = {
        lose_weight: -500,
        maintain: 0,
        gain_muscle: 300,
    };
    return tdee + (adjustments[goal] || 0);
}

/**
 * Convenience function: returns the final daily calorie target.
 */
function calculateDailyTarget(profile) {
    const bmr = calculateBMR(profile);
    const tdee = applyActivityFactor(bmr, profile.activityLevel);
    return adjustByGoal(tdee, profile.healthGoal);
}

module.exports = { calculateBMR, applyActivityFactor, adjustByGoal, calculateDailyTarget };
