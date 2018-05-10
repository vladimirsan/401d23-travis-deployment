'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        bio: 'I am the mountain that rides',
        firstName: 'Gregor',
        lastName: 'Sanchez'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.firstName).toEqual('Gregor');
      expect(response.body.lastName).toEqual('Sanchez');
      expect(response.body.bio).toEqual('I am the mountain that rides');
    });
  });
});