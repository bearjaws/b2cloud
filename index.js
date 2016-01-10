var api = require('./api/index.js');

module.exports = {
  authorizeAccount: api.authorize.getBasicAuth,
  createBucket: api.bucket.createBucket,
  listBuckets: api.bucket.listBuckets,
  getBucketByName: api.bucket.getBucketByName,
  getUploadUrl: api.upload.getUploadUrl,
  uploadFile: api.upload.uploadFile
};