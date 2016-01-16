'use strict';
var _ = require('lodash');
var bluebird = require('bluebird');
var fs = require('fs');
var request = require('request-promise');

var authorize = require('./authorize.js');

class Bucket {
  constructor(cache) {
    this.cache = cache;
    this.Authorize = new authorize(cache);
  }

  /**
   * Creates a bucket in the b2cloud
   *
   * @param {string} name - Name of the bucket
   * @param {string} type - Either allPublic or allPrivate, sets the bucket to public or private access.
   * @param {function} [callback] - The optional callback
   * @returns If no callback provided, retunrs a {Promise} that resolves to the bucket object.
   * Otherwise returns the bucket {object}.
   */
  createBucket(name, type, callback) {
    return this.Authorize.getBasicAuth().then(function(auth) {
      var opts = {
        url: auth.apiUrl + '/b2api/v1/b2_create_bucket',
        headers: {
          Authorization: auth.authorizationToken
        },
        body: {
          accountId: auth.accountId,
          bucketName: name,
          bucketType: type
        },
        json: true,
        method: 'POST'
      };

      return request(opts).then(function(bucket) {
        return bucket;
      }).catch(function(err) {
        return bluebird.reject(err.error);
      });
    }).asCallback(callback);
  }

  /**
   * Lists all buckets you have created.
   *
   * @param {function} [callback] - The optional callback.
   * @return If no callback is provided, returns a {Promise} that resolves to an {array} of bucket {objects}.
   * Otherwise returns the {array} of bucket {objects}.
   */
  listBuckets(callback) {
    return this.Authorize.getBasicAuth().then(function(auth) {
      var opts = {
        url: auth.apiUrl + '/b2api/v1/b2_list_buckets',
        headers: {
          Authorization: auth.authorizationToken
        },
        body: {
          accountId: auth.accountId
        },
        json: true,
        method: 'POST'
      };

      return request(opts).then(function(response) {
        return response.buckets;
      }).catch(function(err) {
        return bluebird.reject(err.error);
      });
    }).asCallback(callback);
  }

  getBucketByName(name, callback) {
    // @todo caching
    return this.listBuckets(callback).then(function(buckets) {
      var theOne = _.find(buckets, function(bucket) {
        return bucket.bucketName === name;
      });
      if(theOne === null) {
        return bluebird.reject('The bucket `'+ name +'` does not exist.');
      }

      return bluebird.resolve(theOne);
    }).asCallback(callback);
  }

  /**
   * Lists all files inside of a bucket.
   *
   * @param {string} name - The name of the bucket
   * @param {string} [startFileName] - If the number of files exceeds the response limit, this will set
   * which file to start listing from
   * @param {number} [maxFileCount] - Max number of files to return, cannot be greater than 1000
   * @see https://www.backblaze.com/b2/docs/b2_list_file_names.html
   * @param {function} [callback] - The optional callback
   */
  listBucketFiles(name, startFileName, maxFileCount, callback) {
    // Make dealing with optional parameters easier
    if(typeof maxFileCount !== 'number') {
      maxFileCount = 100;
    } else if(maxFileCount > 1000) {
      maxFileCount = 1000;
    } else if(maxFileCount < 1) {
      maxFileCount = 1;
    }

    var props = {
      auth: this.Authorize.getBasicAuth(),
      bucket: this.getBucketByName(name)
    };

    return bluebird.props(props).then(function(res) {
      var opts = {
        url: res.auth.apiUrl + '/b2api/v1/b2_list_file_names',
        headers: {
          Authorization: res.auth.authorizationToken
        },
        body: {
          bucketId: res.bucket.bucketId,
          maxFileCount: maxFileCount
        },
        json: true,
        method: 'POST'
      };

      if(startFileName !== null && typeof startFileName === "string") {
        opts.body.startFileName = startFileName;
      }

      return request(opts).then(function(files) {
        return files;
      }).catch(function(err) {
        bluebird.reject(err.error);
      });
    }).asCallback(callback);
  }
}



module.exports = Bucket;