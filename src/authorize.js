'use strict';
var bluebird = require('bluebird');
var fs = require('fs');
var request = require('request-promise');
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 *
 * @param {object} cache
 * @constructor
 */
function Authorize(cache) {
  this.cache = cache;
  var  path = getUserHome() + "/.b2cloud.json";
  if(typeof process.env.B2_ACCOUNT_ID === 'string') {
    this.config = {
      accountId: process.env.B2_ACCOUNT_ID,
      applicationKey: process.env.B2_APPLICATION_KEY
    };
  } else {
    if(! fs.existsSync(path)) {
      throw new Error("Unable to load b2cloud.json from " + path);
    }
    this.config = require(path);
  }
}

/**
 * Fetches an authenticated session for interacting with b2cloud.
 *
 * @param {function} [callback]
 * @returns {object} auth Returns an authenticated session
 * */
Authorize.prototype.getBasicAuth = function(callback) {
  var _this = this;
  // Check if authorization has been cached
  if (typeof this.cache.authorize === "object") {
    if(this.cache.authorize.expires > new Date()) {
      return bluebird.resolve(this.cache.authorize).asCallback(callback);
    }
  }
  var options = {
    url: 'https://api.backblaze.com/b2api/v1/b2_authorize_account',
    headers: {
      Authorization: "Basic" + new Buffer(this.config.accountId + ":" + this.config.applicationKey).toString('base64')
    },
    json: true
  };

  return request(options).then(function(auth) {
    var date = new Date().getTime();
    date += (2 * 60 * 60 * 1000);
    auth.expires = new Date(date);
    _this.cache.authorize = auth;
    return auth;
  }).catch(function(err) {
    return bluebird.reject(err.error);
  }).asCallback(callback);
};


module.exports = Authorize;