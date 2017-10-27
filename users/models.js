'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: String,
  role: {
    type: String,
    default: 'client'
  },
  arrayofGames : [
    {
      gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'BoardGame'},
      numberOfPlayers: Number,
      playedTime: Number,
      playedDate: {
        type: Date, default: Date.now
      }
    }
  ]
});

UserSchema.methods.apiRepr = function () {
  return { 
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User };
