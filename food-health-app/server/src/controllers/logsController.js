// src/controllers/logsController.js — Daily food log CRUD
const Joi = require('joi');
const { db } = require('../services/localDb');
const { calculatePortionNutrition } = require('../services/edamam');

const logSchema = Joi.object({
    foodId: Joi.string().required(),
    label: Joi.string().required(),
    grams: Joi.number().min(1).max(5000).required(),
    mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').default('snack'),
    nutrients: Joi.object({
        ENERC_KCAL: Joi.number(),
        PROCNT: Joi.number(),
        FAT: Joi.number(),
        CHOCDF: Joi.number(),
        FIBTG: Joi.number(),
    }).required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(), // e.g. 2024-01-15
});

const updateSchema = Joi.object({
    grams: Joi.number().min(1).max(5000),
    mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack'),
});

function getLogsCollection(uid) {
    return db.collection('users').doc(uid).collection('dailyLogs');
}

/**
 * GET /api/logs/:date  — Fetch all logs for a given date (YYYY-MM-DD)
 */
async function getLogsForDate(req, res, next) {
    try {
        const { date } = req.params;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: { message: 'Date must be YYYY-MM-DD', code: 'VALIDATION_ERROR' } });
        }

        const snapshot = await getLogsCollection(req.user.uid)
            .where('date', '==', date)
            .orderBy('createdAt', 'asc')
            .get();

        const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ logs });
    } catch (err) {
        return next(err);
    }
}

/**
 * GET /api/logs/weekly — Fetch daily calorie totals for the last 7 days
 */
async function getWeeklyLogs(req, res, next) {
    try {
        const today = new Date();
        const results = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const snapshot = await getLogsCollection(req.user.uid)
                .where('date', '==', dateStr)
                .get();

            const totalCalories = snapshot.docs.reduce(
                (acc, doc) => acc + (doc.data().calories || 0),
                0,
            );
            results.push({ date: dateStr, calories: totalCalories });
        }

        return res.status(200).json({ weekly: results });
    } catch (err) {
        return next(err);
    }
}

/**
 * POST /api/logs — Add a food entry to today's log
 */
async function addLog(req, res, next) {
    try {
        const { error, value } = logSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: error.details },
            });
        }

        const nutrition = calculatePortionNutrition({ nutrients: value.nutrients }, value.grams);
        const logEntry = {
            ...value,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            fiber: nutrition.fiber,
            uid: req.user.uid,
            createdAt: new Date().toISOString(),
        };

        const docRef = await getLogsCollection(req.user.uid).add(logEntry);
        return res.status(201).json({ log: { id: docRef.id, ...logEntry } });
    } catch (err) {
        return next(err);
    }
}

/**
 * PUT /api/logs/:logId — Update a log entry (portion size / meal type)
 */
async function updateLog(req, res, next) {
    try {
        const { error, value } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } });
        }

        const docRef = getLogsCollection(req.user.uid).doc(req.params.logId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: { message: 'Log entry not found', code: 'NOT_FOUND' } });
        }

        const existing = doc.data();
        const updatedData = { ...existing, ...value };

        if (value.grams) {
            const nutrition = calculatePortionNutrition({ nutrients: existing.nutrients }, value.grams);
            Object.assign(updatedData, nutrition);
        }

        updatedData.updatedAt = new Date().toISOString();
        await docRef.update(updatedData);
        return res.status(200).json({ log: { id: doc.id, ...updatedData } });
    } catch (err) {
        return next(err);
    }
}

/**
 * DELETE /api/logs/:logId — Remove a log entry
 */
async function deleteLog(req, res, next) {
    try {
        const docRef = getLogsCollection(req.user.uid).doc(req.params.logId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: { message: 'Log entry not found', code: 'NOT_FOUND' } });
        }

        await docRef.delete();
        return res.status(200).json({ message: 'Log entry deleted' });
    } catch (err) {
        return next(err);
    }
}

module.exports = { getLogsForDate, getWeeklyLogs, addLog, updateLog, deleteLog };
