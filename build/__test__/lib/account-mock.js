'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveAccountMock = exports.pCreateAccountMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateAccountMock = function pCreateAccountMock() {
  var mock = {};
  mock.request = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5)
  };
  return _account2.default.create(mock.request.username, mock.request.email, mock.request.password).then(function (account) {
    mock.account = account;
    return account.pCreateToken(); // Vinicio - this line changes the token Seed
  }).then(function (token) {
    // Vinicio - token is the actual token
    mock.token = token;
    // Vinicio - here, I know that account has changed (tokenSeed)
    return _account2.default.findById(mock.account._id);
  }).then(function (account) {
    mock.account = account;
    return mock;
  });
};

var pRemoveAccountMock = function pRemoveAccountMock() {
  return _account2.default.remove({});
};

exports.pCreateAccountMock = pCreateAccountMock;
exports.pRemoveAccountMock = pRemoveAccountMock;