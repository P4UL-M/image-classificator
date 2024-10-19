const request = require('supertest');
const app = require('../index');
const { httpServerApp } = require('../index');
const { logger } = require('../utils/logger');

beforeAll(() => {
    logger.transports.forEach((t) => (t.silent = true));
});

describe('GET /users', () => {
    it('should return 200 OK', (done) => {
        request(app)
            .get('/users')
            .expect(200, done)
    });
});

describe('GET /whoami', () => {
    it('should return 200 OK', async () => {
        return await request(app)
            .post('/login')
            .send({
                email: 'user1@deway.fr',
                password: 'password1'
            })
            .expect(200)
            .then(async (res) => {
                return await request(app)
                    .get('/whoami')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .expect(200)
                    .expect((res) => {
                        // Validate the user object
                        expect(res.body).toHaveProperty('id');
                        expect(res.body).toHaveProperty('username');
                        expect(res.body).toHaveProperty('email');
                    });
            });
    });
    it('should return 401 Unauthorize', (done) => {
        request(app)
            .get('/whoami')
            .expect(401, done);
    });
});

// Close the server after all tests
afterAll(() => {
    httpServerApp.close();
});