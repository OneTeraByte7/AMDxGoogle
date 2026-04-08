// src/controllers/authController.js — User profile management
const Joi = require('joi');
const { db } = require('../services/localDb');
const { calculateDailyTarget } = require('../utils/calorieCalc');

const profileSchema = Joi.object({
    displayName: Joi.string().max(100),
    age: Joi.number().integer().min(10).max(120).required(),
    weight: Joi.number().min(20).max(500).required(),   // kg
    height: Joi.number().min(50).max(300).required(),   // cm
    gender: Joi.string().valid('male', 'female', 'other').required(),
    activityLevel: Joi.string()
        .valid('sedentary', 'lightly_active', 'moderately_active', 'active', 'very_active')
        .required(),
    dietaryPreference: Joi.string()
        .valid('omnivore', 'vegetarian', 'vegan', 'keto')
        .required(),
    healthGoal: Joi.string()
        .valid('lose_weight', 'maintain', 'gain_muscle')
        .required(),
});

/**
 * POST /api/auth/profile
 * Create or update user profile after first login.
 */
async function upsertProfile(req, res, next) {
    try {
        const { error, value } = profileSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: error.details },
            });
        }

        const uid = req.user.uid;
        const dailyCalorieTarget = calculateDailyTarget(value);

        const profileData = {
            ...value,
            uid,
            email: req.user.email,
            displayName: value.displayName || req.user.name || '',
            dailyCalorieTarget,
            waterGoal: 8, // cups
            updatedAt: new Date().toISOString(),
            profileComplete: true,
        };

        await db.collection('users').doc(uid).set(profileData, { merge: true });

        return res.status(200).json({ profile: profileData });
    } catch (err) {
        return next(err);
    }
}

/**
 * GET /api/auth/profile
 * Fetch the current user's profile.
 */
async function getProfile(req, res, next) {
    try {
        const uid = req.user.uid;
        const doc = await db.collection('users').doc(uid).get();

        if (!doc.exists) {
            return res.status(404).json({ error: { message: 'Profile not found', code: 'NOT_FOUND' } });
        }

        return res.status(200).json({ profile: doc.data() });
    } catch (err) {
        return next(err);
    }
}

module.exports = { upsertProfile, getProfile };
