var authorize = require('./authorize.js');
var bucket = require('./bucket.js');
var upload = require('./upload.js');
var cache = {
  authroize: {},
  bucket: {},
  upload: {}
};
module.exports = {
  authorize: new authorize(cache),
  bucket: new bucket(cache),
  upload: new upload(cache)
};