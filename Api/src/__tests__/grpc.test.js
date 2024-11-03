// Use jest.spyOn to mock `listModels`
jest.spyOn(require('../services/grpc.service.js'), 'listModels').mockImplementation((_, _req, res) => {
    res.status(200).json({
        name: 'testModel',
        description: 'Test model',
        version: '1.0.0',
        accuracy: 0.9
    });
});

jest.spyOn(require('../services/grpc.service.js'), 'classifyFileWithStream').mockImplementation((_, req, res) => {
    req.on('end', () => {
        if (res.headersSent) return;
        else res.status(200).json({ class_name: 'test', confidence: 0.9 });
    });
});

const request = require('supertest');
const app = require('../index');
const { httpServerApp } = require('../index');
const { logger } = require('../utils/logger');


beforeAll(() => {
    logger.transports.forEach((t) => (t.silent = true));
});

describe('GET /models', () => {
    it('should return the model name', async () => {
        // Mock the implementation of listModels
        return await request(app)
            .get('/models')
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({ name: 'testModel', description: 'Test model', version: '1.0.0', accuracy: 0.9 });
            });
    });
});

describe('POST /classify', () => {
    it('should return the class name and confidence', async () => {
        return await request(app)
            .post('/login')
            .send({
                email: 'user1@email.com',
                password: 'password1'
            })
            .expect(200)
            .then(async (res) => {
                return await request(app)
                    .post('/classify')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .set('Content-Type', 'image/jpeg')
                    .send('test')
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toEqual({ class_name: 'test', confidence: 0.9 });
                    }
                    );
            });
    });
    it('Should return 415 Unsupported Media Type', async () => {
        return await request(app)
            .post('/login')
            .send({
                email: 'user1@email.com',
                password: 'password1'
            })
            .expect(200)
            .then(async (res) => {
                return await request(app)
                    .post('/classify')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .send('test')
                    .expect(415);
            });
    });
    it('Should return 401 Unauthorized', async () => {
        return await request(app)
            .post('/classify')
            .set('Content-Type', 'image/jpeg')
            .send('test')
            .expect(401);
    });
});

// Close the server after all tests
afterAll(() => {
    httpServerApp.close();
});