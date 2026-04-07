// tests/food.test.js — Jest + Supertest tests for /api/food/search
const request = require('supertest');

// Mock firebase admin before importing app
jest.mock('../src/services/firebaseAdmin', () => ({
    db: {},
    getAuth: () => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@test.com' }),
    }),
}));

const app = require('../src/app');

describe('GET /api/food/search', () => {
    const AUTH_HEADER = { Authorization: 'Bearer mock-valid-token' };

    it('should return 400 when query is missing', async () => {
        const res = await request(app).get('/api/food/search').set(AUTH_HEADER);
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 200 with an array of foods for a valid query', async () => {
        const res = await request(app)
            .get('/api/food/search?q=chicken')
            .set(AUTH_HEADER);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('foods');
        expect(Array.isArray(res.body.foods)).toBe(true);
        expect(res.body.foods.length).toBeGreaterThan(0);
    });

    it('each food item should have required nutrient fields', async () => {
        const res = await request(app)
            .get('/api/food/search?q=banana')
            .set(AUTH_HEADER);
        expect(res.status).toBe(200);
        const food = res.body.foods[0];
        expect(food).toHaveProperty('foodId');
        expect(food).toHaveProperty('label');
        expect(food.nutrients).toHaveProperty('ENERC_KCAL');
        expect(food.nutrients).toHaveProperty('PROCNT');
        expect(food.nutrients).toHaveProperty('FAT');
    });

    it('should return 401 without an Authorization header', async () => {
        const res = await request(app).get('/api/food/search?q=apple');
        expect(res.status).toBe(401);
    });
});
