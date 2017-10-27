'use strict';

const {router, jwtAuth, basicAuth} = require('./router');
const {basicStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, basicStrategy, jwtStrategy};
