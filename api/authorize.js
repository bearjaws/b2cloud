'use strict';
var bluebird = require('bluebird');
var fs = require('fs');
var request = require('request-promise');

class Authorize {
  constructor() {
    var  path = getUserHome() + "/.b2cloud.json";
    if(! fs.existsSync(path)) {
      throw new Error("Unable to load b2cloud.json from " + path);
    }
    this.config = require(path);
  }

  getConfig() {
    return this.config;
  }

  // @todo cache this response for at least an hour
  getBasicAuth(callback) {
    var options = {
      url: 'https://api.backblaze.com/b2api/v1/b2_authorize_account',
      headers: {
        Authorization: "Basic" + new Buffer(this.config.accountId + ":" + this.config.applicationKey).toString('base64')
      },
      json: true
    };

    return request(options).then(function(auth) {
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