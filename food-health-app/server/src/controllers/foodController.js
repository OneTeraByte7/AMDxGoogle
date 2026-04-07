// src/controllers/foodController.js — Food search via Edamam
const Joi = require('joi');
const { searchFoods } = require('../services/edamam');

const searchSchema = Joi.object({
    q: Joi.string().min(1).max(100).required(),
});

/**
 * GET /api/food/search?q=<query>
 * Returns a list of matching foods with nutritional data.
 */
async function searchFood(req, res, next) {
    try {
        const { error, value } = searchSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: { message: 'Query parameter "q" is required', code: 'VALIDATION_ERROR' },
            });
        }

        const foods = await searchFoods(value.q);
        return res.status(200).json({ foods });
    } catch (err) {
        return next(err);
    }
}

module.exports = { searchFood };
