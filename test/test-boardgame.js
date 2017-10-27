'use strict';

global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { BoardGame } = require('../boardgames');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/boardgames', function() {
  const bgg_url= 'bgg_url';
  const name= '123';
  const minPlayers= 2; 
  const maxPlayers= 4; 
  const avgTime= 120;
  const avgRating= 8; 
  const imgUrl= 'imgUrl';

  before(function () {
    return runServer('mongodb://localhost/jwt-auth-demo-test');
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { 
    return BoardGame.create({
      bgg_url, name, minPlayers, maxPlayers, avgRating,avgTime,imgUrl
      
    });
  });

  afterEach(function () {
    return BoardGame.remove({});
  });

  describe('/api/boardgames', function () {
    describe('GET', function () {

      it('Should return all existing boardgames', function() {
        return chai
          .request(app)
          .get('/api/boardgames')
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res.body.length).to.be.above(0);
            expect(res.body).to.be.an('array');
            res.body.forEach(function(boardgame) {
              expect(boardgame).to.be.an('object');
              expect(boardgame).to.include.keys('bgg_url', 'name','minPlayers','maxPlayers','avgTime','avgRating','imgUrl');
            });
            expect(res).to.be.json;
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });

      it('Should return the requested ID', function () {
        let boardgame;
        return BoardGame
          .findOne()
          .then(function (_boardgame) {
            boardgame = _boardgame;
            return chai
              .request(app)
              .get(`/api/boardgames/${boardgame._id}`);
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
            expect(res.body).to.include.keys('bgg_url', 'name','minPlayers','maxPlayers','avgTime','avgRating','imgUrl');
            expect(res.body.bgg_url).to.deep.equal(boardgame.bgg_url);
            expect(res.body.name).to.deep.equal(boardgame.name);
            expect(res.body.minPlayers).to.deep.equal(boardgame.minPlayers);
            expect(res.body.maxPlayers).to.deep.equal(boardgame.maxPlayers);
            expect(res.body.avgTime).to.deep.equal(boardgame.avgTime);
            expect(res.body.avgRating).to.deep.equal(boardgame.avgRating);

            expect(res.body.imgUrl).to.deep.equal(boardgame.imgUrl);
          });
      });
    });

    describe('POST', function() {

      it('Should add a boardgame', function () {
        const newBoardGame = {bgg_url: 'adf', name: 'name', minPlayers: minPlayers, maxPlayers:maxPlayers, avgTime:avgTime, avgRating:avgRating, imgUrl:imgUrl};
        const token = jwt.sign(
          {
            user: 'girimatt'
          },
          JWT_SECRET,
          {
            // algorithm: 'HS256',
            subject: 'girimatt',
            expiresIn: '7d'
          }
        
        );
        
        return chai
          .request(app)
          .post('/api/boardgames')
          .set('authorization', `Bearer ${token}`)
          .send(newBoardGame)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.an('object');
            expect(res.body).to.include.keys('bgg_url', 'name','minPlayers','maxPlayers','avgTime','avgRating','imgUrl');
            return BoardGame
              .findById(res.body._id)
              .then(function (boardgame) {
                expect(res.body.bgg_url).to.deep.equal(newBoardGame.bgg_url);
                expect(res.body.name).to.deep.equal(newBoardGame.name);
                expect(res.body.minPlayers).to.deep.equal(newBoardGame.minPlayers);
                expect(res.body.maxPlayers).to.deep.equal(newBoardGame.maxPlayers);
                expect(res.body.avgRating).to.deep.equal(newBoardGame.avgRating);
                expect(res.body.avgTime).to.deep.equal(newBoardGame.avgTime);
                expect(res.body.imgUrl).to.deep.equal(newBoardGame.imgUrl);
              });
          });
      });
    });

    describe('DELETE', function () {

      it('Should delete a boardgame', function () {
        let boardgame;
        
        return BoardGame
          .findOne()
          .then(function (_boardgame) {
            boardgame = _boardgame;
            const token = jwt.sign(
              {
                user: 'girimatt'
              },
              JWT_SECRET,
              {
                // algorithm: 'HS256',
                subject: 'girimatt',
                expiresIn: '7d'
              }
            );
            return chai
              .request(app)
              .delete(`/api/boardgames/${boardgame._id}`)
              .set('authorization', `Bearer ${token}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
    });

    describe('PUT', function () {
      
      it('Should update a boardgame', function () {
        const newBoardGame= {bgg_url: bgg_url, name: name, minPlayers: minPlayers, maxPlayers:maxPlayers, avgTime:avgTime, avgRating:avgRating, imgUrl:imgUrl};
        let boardgame;
        return BoardGame
          .findOne()
          .then(function (_boardgame) {
            boardgame = _boardgame;
            newBoardGame._id = boardgame._id;
            const token = jwt.sign(
              {
                user: 'girimatt'
              },
              JWT_SECRET,
              {
                // algorithm: 'HS256',
                subject: 'girimatt',
                expiresIn: '7d'
              }
            );
            return chai
              .request(app)
              .put(`/api/boardgames/${boardgame._id}`)
              .send(newBoardGame)
              .set('authorization', `Bearer ${token}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
    });
  });
});
