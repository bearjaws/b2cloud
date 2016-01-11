# B2Cloud

## A module for interacting with Back Blaze B2Cloud


### Configuration

In ~/.b2cloud.json place your credentials

i.e.
`{
        "accountId": "",
        "applicationKey": ""
}`

Currently under active development

### Whats implemented (from: https://www.backblaze.com/b2/docs/)

- Authorize
  - b2_authorize_account
- Bucket
  - b2_create_bucket
  - b2_list_buckets
- Upload
  - b2_get_upload_url


### Helpers

- function getBucketByName(bucketName, callback)
  - Retreives a bucket object by its name, rather than by bucketId
- function uploadFile(filePath, bucketName, callback)
  - Uploads a file

## All methods are available as promises or callbacks.

## Please note this is being actively worked on and will soon support all API operations as listed here:
https://www.backblaze.com/b2/docs/b2_upload_file.html

I also will be adding helpers methods such as uploadFile, getBucketByName to make it easier to use

