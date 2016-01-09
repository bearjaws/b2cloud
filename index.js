var api = require('./api/index.js');


module.exports = {
  authorizeAccount: api.authorize.getBasicAuth()
};