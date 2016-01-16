var authorize = require('./authorize.js');
var bucket = require('./bucket.js');
var file = require('./file.js');
var cache = {
  authroize: {},
  bucket: {},
  upload: {}
};

module.exports = {
  authorize: new authorize(cache),
  bucket: new bucket(cache),
  file: new file(cache)
};