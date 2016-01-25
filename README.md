# B2Cloud

## A module for interacting with Back Blaze B2Cloud

### Configuration

In ~/.b2cloud.json place your credentials

i.e.
`{
        "accountId": "",
        "applicationKey": ""
}`


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

#### Usage Example:

```

    var b2cloud = require('b2cloud');

    return b2cloud.authorize.getBasicAuth(function(auth) {

        console.log('authenticated', auth);

    });

```

## Classes

<dl>
<dt><a href="#Authorize">Authorize</a></dt>
<dd></dd>
<dt><a href="#Bucket">Bucket</a></dt>
<dd></dd>
<dt><a href="#File">File</a></dt>
<dd></dd>
</dl>

<a name="Authorize"></a>
## Authorize
**Kind**: global class

* [Authorize](#Authorize)
    * [new Authorize(cache)](#new_Authorize_new)
    * [.getBasicAuth([callback])](#Authorize+getBasicAuth) ⇒ <code>object</code>

<a name="new_Authorize_new"></a>
### new Authorize(cache)

| Param | Type |
| --- | --- |
| cache | <code>object</code> |

<a name="Authorize+getBasicAuth"></a>
### authorize.getBasicAuth([callback]) ⇒ <code>object</code>
Fetches an authenticated session for interacting with b2cloud.

**Kind**: instance method of <code>[Authorize](#Authorize)</code>
**Returns**: <code>object</code> - auth Returns an authenticated session

<code>string</code> - auth.accountId - The account ID this session belongs to.

<code>string</code> - auth.apiUrl - The URL to use when performing further API requests.

<code>string</code> - auth.authorizationTocken - The authorization token to be included in permission based requests.

<code>string</code> - auth.downloadUrl - The URL to use when downoading objects.


| Param | Type |
| --- | --- |
| [callback] | <code>function</code> |

<a name="Bucket"></a>
## Bucket
**Kind**: global class

* [Bucket](#Bucket)
    * [new Bucket(cache)](#new_Bucket_new)
    * [.createBucket(name, type, [callback])](#Bucket+createBucket) ⇒ <code>object</code>
    * [.deleteBucket(bucketId, [callback])](#Bucket+deleteBucket) ⇒ <code>object</code>
    * [.listBuckets([callback])](#Bucket+listBuckets) ⇒ <code>object</code>
    * [.getBucketByName(name, [callback])](#Bucket+getBucketByName) ⇒ <code>object</code>
    * [.listBucketFiles(name, [startFileName], [maxFileCount], [callback])](#Bucket+listBucketFiles) ⇒ <code>object</code>

<a name="new_Bucket_new"></a>
### new Bucket(cache)

| Param | Type | Description |
| --- | --- | --- |
| cache | <code>object</code> | Object used for caching requests. |

<a name="Bucket+createBucket"></a>
### bucket.createBucket(name, type, [callback]) ⇒ <code>object</code>
Creates a bucket in the b2cloud

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>object</code> - The response from b2_create_bucket

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the bucket |
| type | <code>string</code> | Either allPublic or allPrivate, sets the bucket to public or private access. |
| [callback] | <code>function</code> | The optional callback |

<a name="Bucket+deleteBucket"></a>
### bucket.deleteBucket(bucketId, [callback]) ⇒ <code>object</code>
Deletes a bucket from the b2cloud

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>object</code> - The response from b2_create_bucket

| Param | Type | Description |
| --- | --- | --- |
| bucketId | <code>string</code> | BucketId as recieved from listBuckets or getBucketByName |
| [callback] | <code>function</code> | The optional callback |

<a name="Bucket+listBuckets"></a>
### bucket.listBuckets([callback]) ⇒ <code>object</code>
Lists all buckets you have created.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>object</code> - The response from b2_list_buckets

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | The optional callback. |

<a name="Bucket+getBucketByName"></a>
### bucket.getBucketByName(name, [callback]) ⇒ <code>object</code>
Helper function that returns a bucket object by its name.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>object</code> - The response from b2_list_buckets

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the bucket. |
| [callback] | <code>function</code> | An optional callback |

<a name="Bucket+listBucketFiles"></a>
### bucket.listBucketFiles(name, [startFileName], [maxFileCount], [callback]) ⇒ <code>object</code>
Lists all files inside of a bucket.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>object</code> - The response from b2_list_file_names
**See**: https://www.backblaze.com/b2/docs/b2_list_file_names.html

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the bucket |
| [startFileName] | <code>string</code> | If the number of files exceeds the response limit, this will set which file to start listing from |
| [maxFileCount] | <code>number</code> | Max number of files to return, cannot be greater than 1000 |
| [callback] | <code>function</code> | The optional callback |

<a name="File"></a>
## File
**Kind**: global class

* [File](#File)
    * [new File(cache)](#new_File_new)
    * [.getUploadUrl(bucketName, [callback])](#File+getUploadUrl) ⇒ <code>object</code>
    * [.uploadFile(filePath, bucketName, [callback])](#File+uploadFile) ⇒ <code>object</code>
    * [.downloadFile(name, bucketName, savePath, range, [callback])](#File+downloadFile) ⇒ <code>Promsise</code>

<a name="new_File_new"></a>
### new File(cache)
Class constructor, instantiates auth and bucket classes


| Param | Type | Description |
| --- | --- | --- |
| cache | <code>object</code> | Cache object shared amongst classes. |

<a name="File+getUploadUrl"></a>
### file.getUploadUrl(bucketName, [callback]) ⇒ <code>object</code>
Gets the uploadUrl for uploadinga file to b2cloud

**Kind**: instance method of <code>[File](#File)</code>
**Returns**: <code>object</code> - - The response from b2_get_upload_url

| Param | Type | Description |
| --- | --- | --- |
| bucketName | <code>string</code> | Name of the bucket to get a uploadUrl for |
| [callback] | <code>function</code> | Optional callback |

<a name="File+uploadFile"></a>
### file.uploadFile(filePath, bucketName, [callback]) ⇒ <code>object</code>
Helper function that automatically generates the uploadUrl, hashes the file and
uploads it to b2cloud.

**Kind**: instance method of <code>[File](#File)</code>
**Returns**: <code>object</code> - - The newly created b2cloud object.

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The file path to the file you want to upload |
| bucketName | <code>string</code> | The bucke to upload the file to. |
| [callback] | <code>function</code> | The optional callback |

<a name="File+downloadFile"></a>
### file.downloadFile(name, bucketName, savePath, range, [callback]) ⇒ <code>Promsise</code>
Downloads a file from b2cloud

**Kind**: instance method of <code>[File](#File)</code>
**Returns**: <code>Promsise</code> - That resolves if the file is downloaded succesfully, otherwise rejects.
**See**: https://www.backblaze.com/b2/docs/b2_download_file_by_name.html

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the file to download |
| bucketName | <code>string</code> | Bucket the file resides in |
| savePath | <code>string</code> | Path to save the file to |
| range | <code>object</code> | The range object used to fetch only a byte range, byte range is inclusive |
| range.start | <code>number</code> | The start byte to download |
| range.end | <code>number</code> | The end byte to download |
| [callback] | <code>function</code> | The optional callback |

