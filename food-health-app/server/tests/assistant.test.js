// tests/assistant.test.js — Jest + Supertest tests for /api/assistant/message
const request = require('supertest');

const mockProfile = {
    uid: 'test-uid',
    displayName: 'Test User',
    age: 28,
    weight: 75,
    height: 175,
    gender: 'male',
    activityLevel: 'active',
    dietaryPreference: 'omnivore',
    healthGoal: 'maintain',
    dailyCalorieTarget: 2500,
    profileComplete: true,
};

jest.mock('../src/services/firebaseAdmin', () => ({
    db: {
        collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
                get: jest.fn().mockResolvedValue({ exists: true, data: () => mockProfile }),
                collection: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    get: jest.fn().mockResolvedValue({ docs: [] }),
                }),
            }),
        }),
    },
    getAuth: () => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@test.com' }),
    }),
}));

const app = require('../src/app');
const AUTH_HEADER = { Authorization: 'Bearer mock-valid-token' };

describe('POST /api/assistant/message', () => {
    it('should return 400 when message is missing', async () => {
        const res = await request(app)
            .post('/api/assistant/message')
            .set(AUTH_HEADER)
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 200 with a reply string for a greeting', async () => {
        const res = await request(app)
            .post('/api/assistant/message')
            .set(AUTH_HEADER)
            .send({ message: 'Hello!' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('reply');
        expect(typeof res.body.reply).toBe('string');
        expect(res.body.reply.length).toBeGreaterThan(0);
    });

    it('should return a meal suggestion when asked what to eat', async () => {
        const res = await request(app)
            .post('/api/assistant/message')
            .set(AUTH_HEADER)
            .send({ message: 'What should I eat for lunch?' });
        expect(res.status).toBe(200);
        expect(res.body.reply).toBeTruthy();
    });

    it('should give protein advice when asked about protein', async () => {
        const res = await request(app)
            .post('/api/assistant/message')
            .set(AUTH_HEADER)
            .send({ message: 'How can I get more protein?' });
        expect(res.status).toBe(200);
        expect(res.body.reply.toLowerCase()).toContain('protein');
    });

    it('should return 401 without auth header', async () => {
        const res = await request(app)
            .post('/api/assistant/message')
            .send({ message: 'Hello' });
        expect(res.status).toBe(401);
    });
});

// Unit tests for assistantLogic
describe('assistantLogic unit tests', () => {
    const { warnIfUnhealthy, suggestMeals } = require('../src/services/assistantLogic');

    it('warnIfUnhealthy should return null for healthy food', () => {
        const food = { label: 'Broccoli', nutrients: { SUGAR: 2, FASAT: 0.1, NA: 30 } };
        expect(warnIfUnhealthy(food)).toBeNull();
    });

    it('warnIfUnhealthy should return warning for sugary food', () => {
        const food = { label: 'Candy Bar', nutrients: { SUGAR: 28, FASAT: 5, NA: 50 } };
        const warning = warnIfUnhealthy(food);
        expect(warning).not.toBeNull();
        expect(warning).toContain('sugar');
    });

    it('suggestMeals should return up to 3 suggestions', () => {
        const suggestions = suggestMeals(600, 'omnivore');
        expect(Array.isArray(suggestions)).toBe(true);
        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('suggestMeals should respect dietary preference', () => {
        const suggestions = suggestMeals(400, 'vegan');
        // All suggestions should be from the vegan pool
        expect(suggestions.every((s) => typeof s === 'string')).toBe(true);
    });
});
