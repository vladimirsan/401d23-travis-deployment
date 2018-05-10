'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _authRouter = require('../route/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _profileRoute = require('../route/profile-route');

var _profileRoute2 = _interopRequireDefault(_profileRoute);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;
//---------------------------------------------------------------------------------
// Vinicio - these routes will be read in-order
// so it's important that our 404 catch-all is the last one
// (1) link in the chain
app.use(_loggerMiddleware2.default); // Vinicio - using an app level middleware
app.use(_authRouter2.default);
app.use(_profileRoute2.default);
//---------------------------------------------------------------------------------
// (2) link in the chain
// Vinicio - manking sure I return a 404 status if I don't have a matching route
app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
//---------------------------------------------------------------------------------
// (3) link in the chain
app.use(_errorMiddleware2.default);
//---------------------------------------------------------------------------------

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    // Vinicio - once I'm here, I know that mongoose is connected
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;