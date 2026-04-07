// src/services/edamam.js — Edamam Nutrition API wrapper with mock fallback
const axios = require('axios');
const config = require('../config');

/** Mock data used when Edamam API keys are not configured */
const MOCK_FOODS = [
    {
        foodId: 'mock_chicken_breast',
        label: 'Chicken Breast',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 165, PROCNT: 31, FAT: 3.6, CHOCDF: 0, FIBTG: 0 },
    },
    {
        foodId: 'mock_greek_yogurt',
        label: 'Greek Yogurt',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 59, PROCNT: 10, FAT: 0.4, CHOCDF: 3.6, FIBTG: 0 },
    },
    {
        foodId: 'mock_brown_rice',
        label: 'Brown Rice (cooked)',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 216, PROCNT: 5, FAT: 1.8, CHOCDF: 45, FIBTG: 3.5 },
    },
    {
        foodId: 'mock_almonds',
        label: 'Almonds',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 579, PROCNT: 21, FAT: 50, CHOCDF: 22, FIBTG: 12.5 },
    },
    {
        foodId: 'mock_banana',
        label: 'Banana',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 89, PROCNT: 1.1, FAT: 0.3, CHOCDF: 23, FIBTG: 2.6 },
    },
    {
        foodId: 'mock_oatmeal',
        label: 'Oatmeal',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 166, PROCNT: 5.9, FAT: 3.6, CHOCDF: 28, FIBTG: 4 },
    },
    {
        foodId: 'mock_salmon',
        label: 'Salmon (cooked)',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 208, PROCNT: 20, FAT: 13, CHOCDF: 0, FIBTG: 0 },
    },
    {
        foodId: 'mock_broccoli',
        label: 'Broccoli (steamed)',
        brand: null,
        category: 'Generic foods',
        nutrients: { ENERC_KCAL: 55, PROCNT: 3.7, FAT: 0.6, CHOCDF: 11, FIBTG: 5.1 },
    },
];

/**
 * Search for foods by query string.
 * Returns a normalised array of food items.
 * Falls back to mock data when API keys are absent.
 */
async function searchFoods(query) {
    const useMock = !config.edamam.appId || !config.edamam.appKey;

    if (useMock) {
        const q = query.toLowerCase();
        const results = MOCK_FOODS.filter((f) => f.label.toLowerCase().includes(q));
        // Return all mocks if no match (so the UI is always populated in dev)
        return results.length ? results : MOCK_FOODS.slice(0, 4);
    }

    const response = await axios.get(`${config.edamam.baseUrl}/api/food-database/v2/parser`, {
        params: {
            app_id: config.edamam.appId,
            app_key: config.edamam.appKey,
            ingr: query,
            'nutrition-type': 'logging',
        },
        timeout: 8000,
    });

    const hints = response.data.hints || [];
    return hints.slice(0, 10).map((hint) => ({
        foodId: hint.food.foodId,
        label: hint.food.label,
        brand: hint.food.brand || null,
        category: hint.food.category,
        nutrients: {
            ENERC_KCAL: hint.food.nutrients.ENERC_KCAL || 0,
            PROCNT: hint.food.nutrients.PROCNT || 0,
            FAT: hint.food.nutrients.FAT || 0,
            CHOCDF: hint.food.nutrients.CHOCDF || 0,
            FIBTG: hint.food.nutrients.FIBTG || 0,
        },
    }));
}

/**
 * Calculate macros for a given food + portion size in grams.
 */
function calculatePortionNutrition(food, grams) {
    const factor = grams / 100;
    return {
        calories: Math.round((food.nutrients.ENERC_KCAL || 0) * factor),
        protein: Math.round((food.nutrients.PROCNT || 0) * factor * 10) / 10,
        carbs: Math.round((food.nutrients.CHOCDF || 0) * factor * 10) / 10,
        fat: Math.round((food.nutrients.FAT || 0) * factor * 10) / 10,
        fiber: Math.round((food.nutrients.FIBTG || 0) * factor * 10) / 10,
    };
}

module.exports = { searchFoods, calculatePortionNutrition };
