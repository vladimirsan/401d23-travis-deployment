'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'hound',
      email: 'hound@gregor.com',
      password: 'hound'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });

  describe('GET /login', function () {
    test('GET /login should get a 200 status code and a TOKEN', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password); // Vinicio - this line is important
      }).then(function (response) {
        // Vinicio - When I login, I get a 200 status code and a TOKEN
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
  });
});