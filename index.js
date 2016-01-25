'use strict';
var authorize = require('./src/authorize.js');
var bucket = require('./src/bucket.js');
var file = require('./src/file.js');
var cache = {
  authorize: {},
  bucket: {},
  file: {}
};

var Auth = new authorize(cache);
var Bucket = new bucket(cache);
var File = new file(cache);
module.exports = {
  auth: Auth,
  authorize: Auth,
  bucket: Bucket,
  file: File
};

//module.exports = B2Cloud;