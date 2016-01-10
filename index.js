var api = require('./api/index.js');

api.upload.uploadFile('./index.js','debugtestlol').then(function(result) {
  console.log(result);
}).catch(function(err) {
  console.log(err);
})

module.exports = {
  authorizeAccount: api.authorize.getBasicAuth,
  createBucket: api.bucket.createBucket,
  listBuckets: api.bucket.listBuckets,
  getBucketByName: api.bucket.getBucketByName,
  getUploadUrl: api.upload.getUploadUrl,
  uploadFile: api.upload.uploadFile
};