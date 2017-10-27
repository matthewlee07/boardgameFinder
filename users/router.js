'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { User } = require('./models');
const { BoardGame } = require('../boardgames');
const config = require('../config');
const basicAuth = passport.authenticate('basic', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  User.find()
    .populate({path: 'arrayofGames.gameId', select: 'name'})
    .then(results => res.json(results));
});

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .populate({path: 'arrayofGames.gameId', select: 'name'})
    .then(games => {
      res.json(games);
    })
    .catch(err=> res.status(500).json({message:'internatl server error'}));
});


router.post('/', jsonParser,  (req, res) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password', 'firstName', 'lastName'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 10, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, firstName, lastName, email } = req.body;

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({ 
        username, password: hash, firstName, lastName, email
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


router.post('/:id/selectedgames', jsonParser, basicAuth, (req, res)=> {
  User.findByIdAndUpdate(req.params.id, {'$push': {
    'arrayofGames': {gameId: req.body.selectedGameId}
  }})
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'internal server error' }));
});

router.post('/:id/usergames', jsonParser, (req, res)=> {
  User.findByIdAndUpdate(req.params.id, {'$push': {
    'arrayofGames': {
      numberOfPlayers: req.body.numberOfPlayers,
      playedTime: req.body.playedTime
    }
  }})
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'internal server error' }));
});

router.put('/:userId/game/:gameId', jsonParser, basicAuth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId,
      'arrayofGames._id': req.params.gameId 
    }, 
    { 'arrayofGames.$.numberOfPlayers': req.body.numberOfPlayers,
      'arrayofGames.$.playedTime': req.body.playedTime
    },
    {new: true}
  )
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = { router };
