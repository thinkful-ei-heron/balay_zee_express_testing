const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return an array of games', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(20);
        expect(res.body[0]).to.be.an('object');
      });
  });
  it('should sort results by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should sort results by app', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'app'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App > res.body[i + 1].App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should filter results by genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(6);
        expect(res.body.every(itm => itm.Genres.includes('Action'))).to.be.true;
      });
  });
  it('should filter by genre and sort by app or rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'action', sort: 'rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(6);
        expect(res.body.every(itm => itm.Genres.includes('Action'))).to.be.true;
        let i = 0, sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});