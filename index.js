var api = require('./src/index.js');


module.exports = {
  authorizeAccount: api.authorize.getBasicAuth,
  createBucket: api.bucket.createBucket,
  listBuckets: api.bucket.listBuckets,
  listBucketFiles: api.bucket.listBucketFiles,
  getBucketByName: api.bucket.getBucketByName,
  getUploadUrl: api.file.getUploadUrl,
  uploadFile: api.file.uploadFile,
  downloadFile: api.file.downloadFile
};