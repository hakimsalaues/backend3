const { expect, request } = require('./sharedChai');
const app = require('../app');

describe('Adoption Routes', () => {
  it('GET /api/adoptions should return all adoptions', done => {
    request(app)
      .get('/api/adoptions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('POST /api/adoptions should create a new adoption', done => {
    const newAdoption = {
      petId: '123456',
      adopterName: 'Juan Pérez',
      contact: 'juan@example.com'
    };

    request(app)
      .post('/api/adoptions')
      .send(newAdoption)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('adoption');
        done();
      });
  });

  // Agrega tests para PUT, DELETE, y casos de error
});
