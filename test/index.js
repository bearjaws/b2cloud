var b2cloud = require('../index.js');
var expect = require('expect.js');
var assert = require('assert');

describe('B2Cloud', function() {
  describe('Auth', function () {
    var time;

    it('should authorize with b2cloud using promises', function (done) {
      return b2cloud.auth.getBasicAuth().then(function (res) {
        expect(res).to.only.have.keys('accountId', 'apiUrl', 'authorizationToken', 'downloadUrl', 'expires');
        done();
        time = new Date();
      });
    });

    it('should authorize with b2cloud using a callback', function (done) {
      b2cloud.auth.getBasicAuth(function(err, auth) {
        expect(auth).to.only.have.keys('accountId', 'apiUrl', 'authorizationToken', 'downloadUrl', 'expires');
        done();
      });
    });

    it('should cache the login token to improve performance', function() {
      b2cloud.auth.getBasicAuth(function() {
        // Typically logins take 100-600ms, cache usually responds in 1ms
        expect(new Date() - time).to.be.below(20);
      });
    });
  });

  describe('Bucket', function () {

    var bucketName;
    var bucket;
    // Used for caching test
    var startTime;

    before(function(done) {
      require('crypto').randomBytes(8, function (ex, buf) {
        bucketName = buf.toString('hex');
        return b2cloud.bucket.createBucket(bucketName, 'allPublic').then(function (res) {
          bucket = res;
          done();
        });
      });
    });

    after(function(done) {
      return b2cloud.bucket.deleteBucket(bucket.bucketId).then(function() {
        done();
      });
    });

    it('should create and delete bucket with b2cloud using promises', function (done) {
      // These operations can be quite slow.
      this.timeout(5000);
      require('crypto').randomBytes(8, function(ex, buf) {
        var bucketName = buf.toString('hex');
        var testBucket;
        return b2cloud.bucket.createBucket(bucketName, 'allPublic').then(function(bucket) {
          testBucket = bucket;
          expect(bucket).to.only.have.keys('accountId', 'bucketId', 'bucketName', 'bucketType');
          return bucket;
        }).then(function(bucket) {
          return b2cloud.bucket.deleteBucket(bucket.bucketId);
        }).then(function(bucket) {
          expect(bucket).to.eql(testBucket);
          done();
        });
      });
    });

    it('should be able to get a bucket object by bucket name', function(done) {
      return b2cloud.bucket.getBucketByName(bucketName).then(function(res) {
        startTime = new Date();
        done();
      });
    });

    it('should use bucket cache when fetching buckets by name', function(done) {
      return b2cloud.bucket.getBucketByName(bucketName).then(function(res) {
        expect(new Date() - startTime).to.be.below(20);
        done();
      });
    });
  });

  describe('File', function () {
    var bucketName;
    var bucket;
    before(function(done) {
      require('crypto').randomBytes(8, function (ex, buf) {
        bucketName = buf.toString('hex');
        return b2cloud.bucket.createBucket(bucketName, 'allPublic').then(function (res) {
          bucket = res;
          done();
        });
      });
    });

    after(function(done) {
      return b2cloud.bucket.deleteBucket(bucket.bucketId).then(function() {
        done();
      });
    });

    it('should be able to get a uploadUrl by bucketName', function (done) {
      return b2cloud.file.getUploadUrl(bucketName).then(function(res) {
        expect(res).to.only.have.keys('authorizationToken', 'bucketId', 'uploadUrl');
        done();
      });
    });
  });
});