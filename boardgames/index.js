'use strict';

const {BoardGame} = require('./models');
const {router} = require('./router');
const {basicStrategy, jwtStrategy} = require('../auth/strategies');

module.exports = {BoardGame, router};
