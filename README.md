# uv-wacz-test

Crawl live sites to produce WARC & WACZ files with local [browsertrix-crawler](https://crawler.docs.browsertrix.com/) via Docker.

## Prerequisites
- Git
- Docker

## Setup
- `docker pull webrecorder/browsertrix-crawler`

## Instructions
Run a crawl with the following command, replacing MY_URL and MY_ID with your values:
``` sh
sh crawl.sh MY_URL MY_ID
```
Once the crawl is finished, a WACZ file will be created in `./crawls/collection/test/MY_ID.wacz`

## QA

Add the `.wacz` file to https://replayweb.page/ to preview it with WebRecorder Playback. (Note: These files do not persist and are *not* a substitute for deposit.)