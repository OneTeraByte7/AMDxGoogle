// tests/auth.summary.test.js — tests for /api/auth/summary
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

jest.mock('../src/services/localDb', () => ({
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

describe('GET /api/auth/summary', () => {
    it('returns profile, todayTotals and weekly', async () => {
        const res = await request(app).get('/api/auth/summary').set(AUTH_HEADER);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('profile');
        expect(res.body).toHaveProperty('todayTotals');
        expect(res.body).toHaveProperty('weekly');
        expect(Array.isArray(res.body.weekly)).toBe(true);
    });

    it('returns 401 without auth header', async () => {
        const res = await request(app).get('/api/auth/summary');
        expect(res.status).toBe(401);
    });
});
