+++
date = "2017-6-23"
draft = false
title = "Google Object Storage notes"
hidefromhome = true
+++

Object store has multiple ways of getting and setting files. I have listed all the ones I can find in this document.

## Permissions & auth
Objects can be stored with user or group level permission. In terms of access there are two different flows to authenticate

> A server-centric flow allows an application to directly hold the
> credentials of a service account to complete authentication.

> A user-centric flow allows an application to obtain credentials. The
> user signs in to complete authentication.

## Different ways to interact with object store
## Google gsutil binary
#### requirements:
	- gcloud sdk + gcloud init
	- user/service account

#### usage
```bash
➜  ~ gsutil ls gs://tower1/
gs://tower1/new_test.txt
gs://tower1/test.txt
gs://tower1/tower--2016-04-14.csv
gs://tower1/tower--2016-04-15.csv
gs://tower1/tower--2016-04-16.csv


➜  ~ gsutil cp gs://tower1/usage_gce_180501337810_201604.csv .
Copying gs://tower1/usage_gce_180501337810_201604.csv...
Downloading file://./usage_gce_180501337810_201604.csv:          555.62 KiB/555.62 KiB

```

----------

## Google python wrapper around the json api
Official google library to interact with their services

#### requirements:
	- gcloud python wrapper https://googlecloudplatform.github.io/gcloud-python/
	- `pip install gcloud`
	- keyfile + service account

#### usage
```python
In [11]: from gcloud import storage
In [12]: client = storage.Client(project='supple-flux-126514')
In [13]: bucket = client.get_bucket('tower1')
In [14]: file = bucket.get_blob('my-test-file.txt')
In [15]: blob.upload_from_string('this is test content!')
```

----------


## Apache libcloud
apache multi cloud provider abstraction tool. I think we should consider this one carefully since it is vendor agnostic. If we end up setting up an openstack + swift  on prem we can switch between the back ends pretty easily

#### requirements:
	-libcloud python wrapper http://libcloud.readthedocs.org/
	- `pip install apache-libcloud pycrypto`
	- keyfile + service account

#### usage
```python


In [13]: from libcloud.storage.drivers.google_storage import GoogleStorageDriver
In [14]: driver = GoogleStorageDriver(
key="zunayedtest@supple-flux-126514.iam.gserviceaccount.com",
secret='keyfile.json')
In [15]: tower = driver.get_container('tower1')
In [16]: tower.list_objects()
Out[16]:
[<Object: name=my-test-file.txt, size=21, hash=0197c049f8ad178d0e96d21d5f02454e, provider=Google Storage ...>,
 <Object: name=new_test.txt, size=0, hash=d41d8cd98f00b204e9800998ecf8427e, provider=Google Storage ...>,
 <Object: name=test.txt, size=10, hash=b05403212c66bdc8ccc597fedf6cd5fe, provider=Google Storage ...>,
 <Object: name=tower--2016-04-14.csv, size=56186, hash=0c2551a097b45b83f37083442eca32d3, provider=Google Storage ...>,
 <Object: name=tower--2016-04-15.csv, size=68060, hash=5a8bb9941cfc78d3292cc06e6cd2eff9, provider=Google Storage ...>,
 <Object: name=tower--2016-04-16.csv, size=67188, hash=2ce36d070324636f1f1b0bff7c50f4fd, provider=Google Storage ...>,
 <Object: name=tower--2016-04-17.csv, size=60865, hash=ce153b491a8fec4adbba0b35dcb7e0c8, provider=Google Storage ...>,
 <Object: name=tower--2016-04-18.csv, size=61161, hash=7e280145851c660b6e93b82ea65b5763, provider=Google Storage ...>,
 <Object: name=tower--2016-04-19.csv, size=33143, hash=5e41c61527776128c4ba95fc6579292a, provider=Google Storage ...>,
 <Object: name=tower--2016-04-20.csv, size=14253, hash=522d509315910c6b28ad2a878ec21526, provider=Google Storage ...>,

```
