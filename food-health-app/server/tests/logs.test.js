// tests/logs.test.js — Jest + Supertest tests for /api/logs
const request = require('supertest');

const mockLogsCollection = {
    docs: [],
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ docs: [] }),
    add: jest.fn().mockResolvedValue({ id: 'new-log-id' }),
    doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false }),
        update: jest.fn(),
        delete: jest.fn(),
    }),
};

jest.mock('../src/services/firebaseAdmin', () => ({
    db: {
        collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(mockLogsCollection),
                get: jest.fn().mockResolvedValue({ exists: false }),
            }),
        }),
    },
    getAuth: () => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@test.com' }),
    }),
}));

const app = require('../src/app');
const AUTH_HEADER = { Authorization: 'Bearer mock-valid-token' };

describe('GET /api/logs/:date', () => {
    it('should return 200 with an array of logs', async () => {
        const res = await request(app).get('/api/logs/2024-01-15').set(AUTH_HEADER);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('logs');
        expect(Array.isArray(res.body.logs)).toBe(true);
    });

    it('should return 400 for invalid date format', async () => {
        const res = await request(app).get('/api/logs/invalid-date').set(AUTH_HEADER);
        expect(res.status).toBe(400);
    });
});

describe('POST /api/logs', () => {
    it('should return 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/logs')
            .set(AUTH_HEADER)
            .send({ foodId: 'test' }); // Missing required fields
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 201 for a valid log entry', async () => {
        // Mock the add to return a proper id
        mockLogsCollection.add.mockResolvedValueOnce({ id: 'new-log-id' });

        const res = await request(app)
            .post('/api/logs')
            .set(AUTH_HEADER)
            .send({
                foodId: 'mock_chicken_breast',
                label: 'Chicken Breast',
                grams: 150,
                mealType: 'lunch',
                date: '2024-01-15',
                nutrients: {
                    ENERC_KCAL: 165,
                    PROCNT: 31,
                    FAT: 3.6,
                    CHOCDF: 0,
                    FIBTG: 0,
                },
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('log');
        expect(res.body.log).toHaveProperty('calories');
        expect(res.body.log).toHaveProperty('protein');
    });
});
