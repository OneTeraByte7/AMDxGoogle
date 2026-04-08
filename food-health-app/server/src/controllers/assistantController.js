// src/controllers/assistantController.js — Smart assistant endpoint
const Joi = require('joi');
const { db } = require('../services/localDb');
const { buildContextReply } = require('../services/assistantLogic');

const messageSchema = Joi.object({
    message: Joi.string().min(1).max(500).required(),
});

/**
 * POST /api/assistant/message
 * Body: { message: string }
 * Returns: { reply: string }
 */
async function sendMessage(req, res, next) {
    try {
        const { error, value } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: { message: 'Message is required (1–500 chars)', code: 'VALIDATION_ERROR' },
            });
        }

        const uid = req.user.uid;

        // Fetch user profile
        const profileDoc = await db.collection('users').doc(uid).get();
        if (!profileDoc.exists) {
            return res.status(404).json({ error: { message: 'Profile not found. Please complete setup.', code: 'NOT_FOUND' } });
        }
        const userProfile = profileDoc.data();

        // Fetch today's logs
        const today = new Date().toISOString().split('T')[0];
        const logsSnapshot = await db
            .collection('users')
            .doc(uid)
            .collection('dailyLogs')
            .where('date', '==', today)
            .get();
        const todayLogs = logsSnapshot.docs.map((doc) => doc.data());

        const dailyTarget = userProfile.dailyCalorieTarget || 2000;
        const reply = buildContextReply(value.message, userProfile, todayLogs, dailyTarget);

        return res.status(200).json({ reply });
    } catch (err) {
        return next(err);
    }
}

module.exports = { sendMessage };
