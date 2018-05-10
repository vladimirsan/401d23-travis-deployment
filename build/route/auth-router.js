'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _basicAuthMiddleware = require('../lib/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vinicio - interview keywords : de-structuring and module
var authRouter = new _express.Router();
var jsonParser = (0, _bodyParser.json)();

authRouter.post('/signup', jsonParser, function (request, response, next) {
  return _account2.default.create(request.body.username, request.body.email, request.body.password).then(function (account) {
    // Vinicio - we want to get rid of the password as early as possible
    delete request.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH - creating TOKEN');
    return account.pCreateToken();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH - returning a 200 code and a token');
    return response.json({ token: token });
  }).catch(next);
});

authRouter.get('/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }
  return request.account.pCreateToken().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'LOGIN - responding with a 200 status and a Token');
    return response.json({ token: token });
  }).catch(next);
});

exports.default = authRouter;