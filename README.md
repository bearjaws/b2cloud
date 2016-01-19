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
### Module Reference

<a name="Authorize"></a>
## Authorize
**Kind**: global class

* [Authorize](#Authorize)
    * [new Authorize(cache)](#new_Authorize_new)
    * [.getBasicAuth([callback])](#Authorize+getBasicAuth) ⇒ <code>object</code>

<a name="new_Authorize_new"></a>
### new Authorize(cache)
Class constructor, reads in credentials and sets up caching


| Param | Type | Description |
| --- | --- | --- |
| cache | <code>object</code> | Cache object shared amongst classes. |

<a name="Authorize+getBasicAuth"></a>
### authorize.getBasicAuth([callback]) ⇒ <code>object</code>
Fetches an authenticated session for interacting with b2cloud.

**Kind**: instance method of <code>[Authorize](#Authorize)</code>
**Returns**: <code>object</code> - If no callback provided, returns a Promise that resolves to the auth response object.
Otherwise returns the auth .

| Param | Type |
| --- | --- |
| [callback] | <code>function</code> |

<a name="Bucket"></a>
## Bucket
**Kind**: global class

* [Bucket](#Bucket)
    * [new Bucket(cache)](#new_Bucket_new)
    * [.createBucket(name, type, [callback])](#Bucket+createBucket) ⇒ <code>Promise</code>
    * [.listBuckets([callback])](#Bucket+listBuckets) ⇒ <code>Promise</code>
    * [.getBucketByName(name, [callback])](#Bucket+getBucketByName) ⇒
    * [.listBucketFiles(name, [startFileName], [maxFileCount], [callback])](#Bucket+listBucketFiles)

<a name="new_Bucket_new"></a>
### new Bucket(cache)

| Param | Type | Description |
| --- | --- | --- |
| cache | <code>object</code> | Cache object shared amongst classes. |

<a name="Bucket+createBucket"></a>
### bucket.createBucket(name, type, [callback]) ⇒ <code>Promise</code>
Creates a bucket in the b2cloud

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>Promise</code> - If no callback provided, retunrs a  that resolves to the bucket object.
Otherwise returns the bucket {object}.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the bucket |
| type | <code>string</code> | Either allPublic or allPrivate, sets the bucket to public or private access. |
| [callback] | <code>function</code> | The optional callback |

<a name="Bucket+listBuckets"></a>
### bucket.listBuckets([callback]) ⇒ <code>Promise</code>
Lists all buckets you have created.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: <code>Promise</code> - If no callback is provided, returns a  that resolves to an {array} of bucket {objects}.
Otherwise returns the {array} of bucket {objects}.

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | The optional callback. |

<a name="Bucket+getBucketByName"></a>
### bucket.getBucketByName(name, [callback]) ⇒
Helper function that returns a bucket object by its name.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
**Returns**: A promise that resolves with the bucket object if found, otherwise rejects.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the bucket. |
| [callback] | <code>function</code> | An optional callback |

<a name="Bucket+listBucketFiles"></a>
### bucket.listBucketFiles(name, [startFileName], [maxFileCount], [callback])
Lists all files inside of a bucket.

**Kind**: instance method of <code>[Bucket](#Bucket)</code>
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
    * [.getUploadUrl(bucketName, [callback])](#File+getUploadUrl)
    * [.uploadFile(filePath, bucketName, [callback])](#File+uploadFile)
    * [.downloadFile(name, bucketName, savePath, range, [callback])](#File+downloadFile)

<a name="new_File_new"></a>
### new File(cache)
Class constructor, instantiates auth and bucket classes


| Param | Type | Description |
| --- | --- | --- |
| cache | <code>object</code> | Cache object shared amongst classes. |

<a name="File+getUploadUrl"></a>
### file.getUploadUrl(bucketName, [callback])
Gets the uploadUrl for uploadinga file to b2cloud

**Kind**: instance method of <code>[File](#File)</code>

| Param | Type | Description |
| --- | --- | --- |
| bucketName | <code>string</code> | Name of the bucket to get a uploadUrl for |
| [callback] | <code>function</code> | Optional callback |

<a name="File+uploadFile"></a>
### file.uploadFile(filePath, bucketName, [callback])
Helper function that automatically generates the uploadUrl, hashes the file and
uploads it to b2cloud.

**Kind**: instance method of <code>[File](#File)</code>

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The file path to the file you want to upload |
| bucketName | <code>string</code> | The bucke to upload the file to. |
| [callback] | <code>function</code> | The optional callback |

<a name="File+downloadFile"></a>
### file.downloadFile(name, bucketName, savePath, range, [callback])
Downloads a file from b2cloud

**Kind**: instance method of <code>[File](#File)</code>
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



