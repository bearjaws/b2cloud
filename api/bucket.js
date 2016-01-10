'use strict';
var _ = require('lodash');
var bluebird = require('bluebird');
var fs = require('fs');
var request = require('request-promise');

var authorize = require('./authorize.js');
var Authorize = new authorize();

class Bucket {
  createBucket(name, type, callback) {
    return Authorize.getBasicAuth().then(function(auth) {
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

  listBuckets(callback) {
    return Authorize.getBasicAuth().then(function(auth) {
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
}


module.exports = Bucket;