const { expect, request } = require('./sharedChai');
const app = require('../app');
const User = require('../models/user');

describe('Sessions Routes', () => {
  let token;

  const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "testuser@example.com",
    age: 30,
    password: "123456"
  };

  // Antes de correr los tests, eliminar el usuario para evitar duplicados
  before(async () => {
    await User.deleteOne({ email: testUser.email });
  });

  it('POST /api/sessions/register should register a user', done => {
    request(app)
      .post('/api/sessions/register')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        expect(res.body.user).to.have.property('email', testUser.email);
        done();
      });
  });

  it('POST /api/sessions/login should return a JWT token', done => {
    request(app)
      .post('/api/sessions/login')
      .send({ email: testUser.email, password: testUser.password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('GET /api/sessions/current should return user data with valid token', done => {
    request(app)
      .get('/api/sessions/current')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', testUser.email);
        done();
      });
  });

  it('GET /api/sessions/current should return 401 without token', done => {
    request(app)
      .get('/api/sessions/current')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
