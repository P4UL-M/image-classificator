const request = require('supertest');
const app = require('../index');
const { httpServerApp } = require('../index');
const { logger } = require('../utils/logger');

beforeAll(() => {
    logger.transports.forEach((t) => (t.silent = true));
});

const email = `test${Math.floor(Math.random() * 100000)}@email.com`;

describe('POST /register', () => {
    it('should return 201 OK', (done) => {
        request(app)
            .post('/register')
            .send({
                username: 'test',
                email: email,
                password: 'password'
            })
            .expect(201, done)
    });
    it('should return 400 Bad Request - Missing required fields', async () => {
        return await request(app)
            .post('/register')
            .send({
                email: 'email@test.com',
                password: 'password'
            })
            .expect(400).expect((res) => {
                expect(res.text).toBe('Missing required fields.');
            });
    });
    it('should return 400 Bad Request - User already exists', async () => {
        return await request(app)
            .post('/register')
            .send({
                username: 'test',
                email: email,
                password: 'password'
            })
            .expect(400).expect((res) => {
                expect(res.text).toBe('User already exists.');
            });
    });
    it('should return 400 Bad Request - Invalid user data', async () => {
        return await request(app)
            .post('/register')
            .send({
                username: 'test',
                email: 'invalideEmail',
                password: 'password'
            })
            .expect(400).expect((res) => {
                expect(res.text).toBe('Invalid user data.');
            });
    });
});

describe('POST /login', () => {
    it('should return 200 OK', async () => {
        return await request(app)
            .post('/login')
            .send({
                email: email,
                password: 'password'
            })
            .expect(200)
            .expect((res) => {
                // Validate the token is a non-empty string
                expect(res.body.token).toEqual(expect.stringMatching(/.+/));
            });
    });
    it('should return 401 Unauthorize', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'nottest@email.com',
                password: 'password'
            })
            .expect(401, done);
    });
});

// Close the server after all tests
afterAll(() => {
    httpServerApp.close();
});