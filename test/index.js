var b2cloud = require('../index.js');
var expect = require('expect.js');
var assert = require('assert');

describe('B2Cloud', function() {
  this.timeout(20000);
  describe('Auth', function () {
    var time;

    it('should authorize with b2cloud using promises', function (done) {
      this.timeout(5000);
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
    var file;
    // Used for caching test
    var startTime;

    before(function(done) {
      this.timeout(15000);
      require('crypto').randomBytes(8, function (ex, buf) {
        bucketName = "test" + buf.toString('hex');
        return b2cloud.bucket.createBucket(bucketName, 'allPublic').then(function (res) {
          bucket = res;
          return b2cloud.file.uploadFile('./test/data/backblaze-logo.gif', bucketName);
        }).then(function(res) {
          file = res;
          done();
        });
      });
    });

    after(function(done) {
      this.timeout(15000);
      return b2cloud.file.deleteFileVersion(file.fileName, file.fileId).then(function() {
        return b2cloud.bucket.deleteBucket(bucket.bucketId)
      }).then(function() {
        done();
      })
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
      this.timeout(5000);
      return b2cloud.bucket.getBucketByName(bucketName).then(function(res) {
        expect(res).to.eql(bucket);
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

    it('should list all files inside a bucket', function(done) {
      this.timeout(5000);
      return b2cloud.bucket.listBucketFiles(bucketName).then(function(res) {
        expect(res.files.length).to.eql(1);
        expect(res.files[0].fileId).to.eql(file.fileId);
        done();
      });
    });
  });

  describe('File', function () {
    var bucketName;
    var bucket;
    before(function(done) {
      this.timeout(5000);
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
      this.timeout(5000);
      return b2cloud.file.getUploadUrl(bucketName).then(function(res) {
        expect(res).to.only.have.keys('authorizationToken', 'bucketId', 'uploadUrl');
        done();
      });
    });

    it('should be able to upload and delete a file', function(done) {
      this.timeout(25000);
      var file;
      return b2cloud.file.uploadFile('./test/data/backblaze-logo.gif', bucketName).then(function(res) {
        file = res;
        return b2cloud.file.deleteFileVersion(res.fileName, res.fileId);
      }).then(function(res) {
        expect(res.fileId).to.eql(file.fileId);
        done();
      });
    });
  });
});