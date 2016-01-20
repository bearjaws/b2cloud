'use strict';
var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var path = require('path');
var rp = require('request-promise');
var request = require('request');
var crypto = require('crypto');

var authorize = require('./authorize.js');
var bucket = require('./bucket.js');

class File {

  /**
   * Class constructor, instantiates auth and bucket classes
   *
   * @param {object} cache - Cache object shared amongst classes.
   */
  constructor(cache) {
    this.Authorize = new authorize(cache);
    this.Bucket = new bucket(cache);
  }

  /**
   * Gets the uploadUrl for uploadinga file to b2cloud
   *
   * @param {string} bucketName - Name of the bucket to get a uploadUrl for
   * @param {function} [callback] - Optional callback
   * @return {object} - The response from b2_get_upload_url
   */
  getUploadUrl(bucketName, callback) {
    var _this = this;
    var props = {
      auth: this.Authorize.getBasicAuth(callback),
      bucket: this.Bucket.getBucketByName(bucketName, callback)
    };

    return bluebird.props(props).then(function(res) {
      var opts = {
        url: res.auth.apiUrl + '/b2api/v1/b2_get_upload_url',
        headers: {
          Authorization: res.auth.authorizationToken
        },
        body: {
          bucketId: res.bucket.bucketId
        },
        json: true,
        method: 'POST'
      };
      return rp(opts);
    }).then(function(response) {
      return response;
    }).asCallback(callback);
  }

  /**
   * Helper function that automatically generates the uploadUrl, hashes the file and
   * uploads it to b2cloud.
   *
   * @param {string} filePath - The file path to the file you want to upload
   * @param {string} bucketName - The bucke to upload the file to.
   * @param {function} [callback] - The optional callback
   * @return {object} - The newly created b2cloud object.
   */
  uploadFile(filePath, bucketName, callback) {
    var _this = this;
    var filename = path.basename(filePath);

    var props = {
      url: _this.getUploadUrl(bucketName, callback),
      stats: fs.statAsync(filePath),
      hash: getShaPromise(filePath)
    };

    return bluebird.props(props).then(function(res) {
      var opts = {
        url: res.url.uploadUrl,
        headers: {
          Authorization: res.url.authorizationToken,
          "X-Bz-File-Name": filename,
          "Content-Type": "b2/x-auto", // @todo allow content-type to be specified
          "Content-Length": res.stats.size,
          "X-Bz-Content-Sha1": res.hash,
        },
        method: 'POST'
      };

      return new bluebird(function(resolve, reject) {
        fs.createReadStream(filePath).pipe(request(opts, function(err, res) {
          if(res.statusCode === 200) {
            resolve(res.body);
          } else {
            reject(res.body);
          }
        }));
      });
    }).asCallback(callback);
  }

  /**
   * Downloads a file from b2cloud
   *
   * @param {string} name - Name of the file to download
   * @param {string} bucketName - Bucket the file resides in
   * @param {string} savePath - Path to save the file to
   * @param {object} range - The range object used to fetch only a byte range, byte range is inclusive
   * @param {number} range.start - The start byte to download
   * @param {number} range.end - The end byte to download
   * @see https://www.backblaze.com/b2/docs/b2_download_file_by_name.html
   * @param {function} [callback] - The optional callback
   * @returns {Promsise} That resolves if the file is downloaded succesfully, otherwise rejects.
   */
  downloadFile(name, bucketName, savePath, range, callback) {
    if(typeof range === 'function') {
      callback = range;
    }

    return this.Authorize.getBasicAuth().then(function(auth) {
      var url = auth.downloadUrl + "/file/" + bucketName + "/" + name;

      var opts = {
        url: url,
        headers: {
          Authorization: auth.authorizationToken,
        },
        method: 'GET'
      };

      if (typeof range === "object" && range !== null) {
        opts.headers.range = "bytes=" + range.start + "-" + range.end
      }

      savePath = path.resolve(savePath);
      return new bluebird(function(resolve, reject) {
        var download = request(opts);
        var headers;
        download.on('response', function(res) {
          headers = res.headers;
          res.pipe(fs.createWriteStream(savePath));
        });

        download.on('end', function() {
          return resolve(headers);
        });
      });

    }).asCallback(callback);
  }
}

// Returns a promise that resolves with the hex digest, otherwise rejects
function getShaPromise(filePath) {
  return new bluebird(function(resolve, reject) {
    var fd = fs.createReadStream(filePath);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    fd.on('end', function() {
      hash.end();
      return resolve(hash.read());
    });
    fd.on('error', function(err) {
      return reject(err);
    });
    fd.pipe(hash);
  });
}

module.exports = File;