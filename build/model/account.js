'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vinicio - CAPS naming conventions apply to strings and numbers
// Vinicio - used to generate random data
var HASH_ROUNDS = 8; // Vinicio - used to generate hash

var TOKEN_SEED_LENGTH = 128;

// VINICIO - THIS SCHEMA SHOULD NEVER LEAVE THE SERVER
var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

// Vinicio - This function is going to be used to login
function pVerifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      // Vinicio - A 401 code would be the 'proper' response
      throw new _httpErrors2.default(400, 'AUTH - incorrect data');
    }
    return _this; // Vinicio - return this; returns the current account
  });
}

function pCreateToken() {
  // Vinicio - `this` is equal to the account object we are working with.
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    // Vinicio - at this point, we have a token seed.
    // Vinicio - sign === encrypt
    return _jsonwebtoken2.default.sign( // Vinicio - this line retuns a promise that resolves to a token
    { tokenSeed: account.tokenSeed }, process.env.SOUND_CLOUD_SECRET); // Vinicio - When this promises resolves, I have a token
  });
  // Vinicio - TODO: error management
}

accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

var Account = _mongoose2.default.model('account', accountSchema);

/* Hash variables:
    - SALT
    - Hashing algo (bcrypt)
    - password
    - rounds
 */
Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    // Vinicio - we have the password hash
    password = null; // eslint-disable-line
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // Vinicio - hex is used due to HTTP
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;