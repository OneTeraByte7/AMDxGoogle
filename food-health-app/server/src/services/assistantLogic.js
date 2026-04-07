// src/services/assistantLogic.js — Rule-based smart assistant engine

/**
 * Hourly greeting helper.
 */
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

/**
 * Warning thresholds
 */
const THRESHOLDS = {
    sugar: 15,        // grams per serving
    saturatedFat: 8,  // grams per serving
    sodium: 600,      // mg per serving
};

/**
 * Warn if a food item is high in sugar or saturated fat.
 * foodItem: { label, nutrients: { sugar?, saturatedFat?, sodium? } }
 * Returns a warning string or null.
 */
function warnIfUnhealthy(foodItem) {
    const n = foodItem.nutrients || {};
    const warnings = [];

    if (n.SUGAR && n.SUGAR > THRESHOLDS.sugar) {
        warnings.push(`high in sugar (${n.SUGAR.toFixed(1)}g)`);
    }
    if (n.FASAT && n.FASAT > THRESHOLDS.saturatedFat) {
        warnings.push(`high in saturated fat (${n.FASAT.toFixed(1)}g)`);
    }
    if (n.NA && n.NA > THRESHOLDS.sodium) {
        warnings.push(`high in sodium (${n.NA.toFixed(0)}mg)`);
    }

    if (warnings.length === 0) return null;
    return `⚠️ Heads up! ${foodItem.label} is ${warnings.join(' and ')}. Consider smaller portions.`;
}

/**
 * Suggest meals based on remaining calories and dietary preference.
 * dietaryPreference: 'omnivore' | 'vegetarian' | 'vegan' | 'keto'
 */
function suggestMeals(remainingCalories, dietaryPreference) {
    const suggestions = {
        omnivore: [
            { name: 'Grilled chicken breast + steamed broccoli', kcal: 270 },
            { name: 'Greek yogurt with mixed berries', kcal: 150 },
            { name: 'Salmon with quinoa salad', kcal: 420 },
            { name: 'Turkey lettuce wraps', kcal: 200 },
            { name: 'Boiled eggs + avocado toast (1 slice)', kcal: 280 },
        ],
        vegetarian: [
            { name: 'Paneer tikka with mint chutney', kcal: 320 },
            { name: 'Greek yogurt with walnuts and honey', kcal: 180 },
            { name: 'Lentil soup + whole-grain bread', kcal: 380 },
            { name: 'Spinach omelette (2 eggs)', kcal: 200 },
            { name: 'Cottage cheese with sliced cucumber', kcal: 130 },
        ],
        vegan: [
            { name: 'Chickpea & spinach curry with brown rice', kcal: 420 },
            { name: 'Almond butter on rice cakes', kcal: 200 },
            { name: 'Smoothie bowl: banana, berries, almond milk', kcal: 280 },
            { name: 'Tofu stir-fry with mixed vegetables', kcal: 350 },
            { name: 'Hummus with carrot & celery sticks', kcal: 160 },
        ],
        keto: [
            { name: 'Avocado stuffed with tuna', kcal: 320 },
            { name: 'Bacon-wrapped asparagus', kcal: 250 },
            { name: 'Cheese & pepperoni roll-ups', kcal: 200 },
            { name: 'Ground beef lettuce tacos', kcal: 380 },
            { name: 'Egg salad with celery sticks', kcal: 270 },
        ],
    };

    const pool = suggestions[dietaryPreference] || suggestions.omnivore;

    // Filter to only suggest meals that fit the remaining budget (within 50 kcal tolerance)
    const fitting = pool.filter((m) => m.kcal <= remainingCalories + 50);

    if (fitting.length === 0) {
        return ['You are very close to your calorie limit. Try a light snack like cucumber slices or herbal tea. 🍵'];
    }

    // Pick up to 3 suggestions
    return fitting.slice(0, 3).map((m) => `🍽️ ${m.name} (~${m.kcal} kcal)`);
}

/**
 * Generate a morning greeting with the day's calorie budget.
 */
function getDailyGreeting(userProfile, dailyTarget) {
    const tod = getTimeOfDay();
    const name = userProfile.displayName ? userProfile.displayName.split(' ')[0] : 'there';
    return `Good ${tod}, ${name}! 👋 Your calorie budget for today is **${dailyTarget} kcal**. Let's make it count!`;
}

/**
 * Summarise today's intake so far.
 */
function summariseIntake(todayLogs) {
    const totals = todayLogs.reduce(
        (acc, log) => {
            acc.calories += log.calories || 0;
            acc.protein += log.protein || 0;
            acc.carbs += log.carbs || 0;
            acc.fat += log.fat || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    return totals;
}

/**
 * Answer simple predefined questions.
 */
function answerSimpleQuestion(message, userProfile) {
    const msg = message.toLowerCase();

    if (msg.includes('protein')) {
        const prefs = {
            vegan: 'tofu, edamame, lentils, chickpeas, and tempeh',
            vegetarian: 'eggs, cottage cheese, Greek yogurt, lentils, and paneer',
            keto: 'eggs, chicken breast, fatty fish, beef, and cheese',
            omnivore: 'chicken breast, eggs, Greek yogurt, tuna, and cottage cheese',
        };
        const items = prefs[userProfile.dietaryPreference] || prefs.omnivore;
        return `💪 For a protein boost, try: **${items}**. Aim for ~30g protein per meal for best muscle retention.`;
    }

    if (msg.includes('weight') && (msg.includes('lose') || msg.includes('loss'))) {
        return `🎯 For weight loss, focus on a calorie deficit of ~500 kcal/day, prioritise lean proteins to stay full, eat plenty of fibre-rich vegetables, and limit liquid calories.`;
    }

    if (msg.includes('carb') || msg.includes('energy')) {
        return `⚡ For sustained energy, choose complex carbs: oatmeal, sweet potato, quinoa, and whole-grain bread. Pair them with protein to avoid blood sugar spikes.`;
    }

    if (msg.includes('fat') || msg.includes('healthy fat')) {
        return `🥑 Healthy fats are your friends! Include avocado, olive oil, nuts, seeds, and fatty fish (salmon/mackerel) in your diet. They support brain health and hormone balance.`;
    }

    if (msg.includes('water') || msg.includes('hydrat')) {
        return `💧 Aim for at least 8 cups (2 litres) of water daily. Drinking a glass before each meal can also help control portions!`;
    }

    if (msg.includes('sleep')) {
        return `😴 Quality sleep is essential for weight management. Aim for 7–9 hours. Poor sleep raises ghrelin (hunger hormone) and lowers leptin (satiety hormone).`;
    }

    if (msg.includes('snack')) {
        const snacks = {
            vegan: 'hummus with veggies, rice cakes with almond butter, or a piece of fruit with nuts',
            vegetarian: 'Greek yogurt, a boiled egg, or cheese with whole-grain crackers',
            keto: 'cheese cubes, hard-boiled eggs, or pepperoni slices',
            omnivore: 'Greek yogurt, a handful of almonds, or turkey slices with cucumber',
        };
        const s = snacks[userProfile.dietaryPreference] || snacks.omnivore;
        return `🥗 Smart snack ideas for you: **${s}**. Keep it under 200 kcal for best results.`;
    }

    return null; // No match — fall through to general context reply
}

/**
 * Main context-aware reply builder.
 * message: the user's chat message (string)
 * userProfile: { displayName, dietaryPreference, healthGoal, ... }
 * todayLogs: array of log entries for today
 * dailyTarget: calculated calorie target
 */
function buildContextReply(message, userProfile, todayLogs, dailyTarget) {
    // 1. Try simple Q&A
    const simpleAnswer = answerSimpleQuestion(message, userProfile);
    if (simpleAnswer) return simpleAnswer;

    // 2. Intake summary
    const totals = summariseIntake(todayLogs);
    const remaining = dailyTarget - totals.calories;

    // 3. If message is a greeting, give a greeting + summary
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some((g) => message.toLowerCase().includes(g))) {
        const greeting = getDailyGreeting(userProfile, dailyTarget);
        if (todayLogs.length === 0) {
            return `${greeting}\n\nYou haven't logged any meals yet today. Let's start tracking! 🚀`;
        }
        return `${greeting}\n\nSo far today: **${totals.calories} kcal** consumed. You have **${Math.max(0, remaining)} kcal** remaining.\nProtein: ${totals.protein.toFixed(1)}g | Carbs: ${totals.carbs.toFixed(1)}g | Fat: ${totals.fat.toFixed(1)}g`;
    }

    // 4. Meal suggestion request
    const suggestionTriggers = ['eat', 'meal', 'food', 'suggest', 'recommend', 'hungry', 'what should'];
    if (suggestionTriggers.some((t) => message.toLowerCase().includes(t))) {
        if (remaining <= 0) {
            return `🚫 You've reached your calorie goal for today (${dailyTarget} kcal). Great discipline! Stick to water and herbal tea, and maybe a light walk. 🚶`;
        }
        const meals = suggestMeals(remaining, userProfile.dietaryPreference);
        return `You have **${remaining} kcal** remaining today. Here are some great options:\n\n${meals.join('\n')}`;
    }

    // 5. Generic contextual reply
    const pct = dailyTarget > 0 ? Math.round((totals.calories / dailyTarget) * 100) : 0;
    if (pct >= 90) {
        return `🎉 You've consumed ${pct}% of your daily calorie goal (${totals.calories}/${dailyTarget} kcal). You're almost at your limit for today — great job staying on track!`;
    }
    if (pct < 30 && todayLogs.length > 0) {
        return `📉 You've only consumed ${pct}% of your daily goal so far. Make sure you're eating enough — under-eating can slow your metabolism. You still have **${remaining} kcal** to go!`;
    }

    return `I'm here to help with meal suggestions, nutrition tips, and tracking your goals. You've had **${totals.calories} kcal** today out of **${dailyTarget} kcal**. Ask me anything like "What can I eat?" or "Give me a protein boost tip!" 💬`;
}

/**
 * Get the daily recommendation message (used for automatic morning/context updates).
 */
function getDailyRecommendation(userProfile, todayLogs, remainingCalories) {
    if (todayLogs.length === 0) {
        return getDailyGreeting(userProfile, userProfile.dailyCalorieTarget || 2000)
            + '\n\nStart by logging your first meal of the day to get personalised suggestions! 🥗';
    }

    const meals = suggestMeals(remainingCalories, userProfile.dietaryPreference);
    const totals = summariseIntake(todayLogs);

    return `You've consumed **${totals.calories} kcal** today with **${remainingCalories} kcal** left in your budget.\n\nBased on your remaining budget, try:\n${meals.join('\n')}`;
}

module.exports = {
    buildContextReply,
    getDailyRecommendation,
    suggestMeals,
    warnIfUnhealthy,
    summariseIntake,
};
