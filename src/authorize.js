'use strict';
var bluebird = require('bluebird');
var fs = require('fs');
var request = require('request-promise');

class Authorize {

  /**
   * Class constructor, reads in credentials and sets up caching
   *
   * @param {object} cache - Cache object shared amongst classes.
   */
  constructor(cache) {
    this.cache = cache;
    var  path = getUserHome() + "/.b2cloud.json";
    if(! fs.existsSync(path)) {
      throw new Error("Unable to load b2cloud.json from " + path);
    }
    this.config = require(path);
  }

  getConfig() {
    return this.config;
  }

  /**
   * Fetches an authenticated session for interacting with b2cloud.
   *
   * @param {function} [callback]
   * @returns {object} auth Returns an authenticated session
   * @returns {string} auth.accountId - The account ID this session belongs to.
   * @returns {string} auth.apiUrl - The URL to use when performing further API requests.
   * @returns {string} auth.authorizationTocken - The authorization token to be included in permission based requests.
   * @returns {string} auth.downloadUrl - The URL to use when downoading objects.
   * */
  getBasicAuth(callback) {
    var _this = this;
    // Check if authorization has been cached
    if (typeof this.cache.authorize === "object") {
      if(this.cache.authorize.expires > new Date()) {
        return bluebird.resolve(this.cache.authorize);
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
  }
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = Authorize;