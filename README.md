# B2Cloud

## A module for interacting with Back Blaze B2Cloud

### Configuration

In ~/.b2cloud.json place your credentials

i.e.
`{
        "accountId": "",
        "applicationKey": ""
}`


### Whats implemented (from: https://www.backblaze.com/b2/docs/)

- Authorize
  - b2_authorize_account
- Bucket
  - b2_create_bucket
  - b2_list_buckets
  - b2_list_file_names
- Upload
  - b2_get_upload_url


### Helpers

- function getBucketByName(bucketName, callback)
  - Retreives a bucket object by its name, rather than by bucketId
- function uploadFile(filePath, bucketName, callback)
  - Uploads a file
- function downloadFile(name, bucketName, savePath, range, callback)
  - Downloads a file
  - Range is an optional object with properties start and end i.e. { start: 0, end: 1000 }
  - Range is number of bytes (inclusive) that will be downloaded
  - See b2 documentation https://www.backblaze.com/b2/docs/b2_download_file_by_name.html

## Please note this is being actively worked on and will soon support all API operations as listed here:
https://www.backblaze.com/b2/docs/

I also will be adding helpers methods such as uploadFile, getBucketByName to make it easier to use

## Documentation
### All methods can use promises or callbacks
#### Installation
```npm install b2cloud```

Setup a file ```.b2cloud``` in your home folder. Setup like this:,

```
{
        "accountId": "",
        "applicationKey": ""
}
```
#### Authorization
```
var b2cloud = require('b2cloud');
b2cloud.getBasicAuth(callback)
or
b2cloud.getBasicAuth().then(function(auth) {
// authorized
});
```
Please note that getBasicAuth caches the auth token for 2 hours, or until your process closes.
#### Buckets
`function createBucket(name, type)`
```
/**
   * Creates a bucket in the b2cloud
   *
   * @param {string} name - Name of the bucket
   * @param {string} type - Either allPublic or allPrivate, sets the bucket to public or private access.
   * @param {function} [callback] - The optional callback
   * @returns If no callback provided, retunrs a {Promise} that resolves to the bucket object.
   * Otherwise returns the bucket {object}.
   */
b2cloud.createBucket(name, type, callback)
````
`function listBuckets()`
```
/**
   * Lists all buckets you have created.
   *
   * @param {function} [callback] - The optional callback.
   * @return If no callback is provided, returns a {Promise} that resolves to an {array} of bucket {objects}.
   * Otherwise returns the {array} of bucket {objects}.
   */
   b2cloud.istBuckets(callback)
```
`function listBucketFiles(name)`
```
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
  listBucketFiles(name, startFileName, maxFileCount, callback)
  ```

#### Files
`getUploadUrl(bucketName)`
```
/**
   * Gets the uploadUrl for uploadinga file to b2cloud
   *
   * @param {string} bucketName - Name of the bucket to get a uploadUrl for
   * @param {function} [callback] - Optional callback
   */
  getUploadUrl(bucketName, callback) {
  ```
`uploadFile(filePath, bucketName)`
```
/**
   * Helper function that automatically generates the uploadUrl, hashes the file and
   * uploads it to b2cloud.
   *
   * @param {string} filePath - The file path to the file you want to upload
   * @param {string} bucketName - The bucke to upload the file to.
   * @param {function} [callback] - The optional callback
   */
```
`downloadFile(name, bucketName, savePath, range)`
```
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
   */
downloadFile(name, bucketName, savePath, range, callback)
```