# uv-wacz-test

Crawl live sites to produce WACZ files with local [browsertrix-crawler](https://crawler.docs.browsertrix.com/) via Docker. 

Results are stored here* under `/crawls/collections`  for demo/test use in UltraViolet as part of WebRecorder playback custom previewer development (WiP, 2025)

*on RW/locally; .gitignored due to size

## Prerequisites
- Git
- Docker

## Setup
- `docker pull webrecorder/browsertrix-crawler`

## Instructions


1. **CRAWL:** Run a crawl with the following command, replacing `MY_URL` and `MY_ID` with your values. `MY_URL` should start with `http://` or `https://`; `MY_ID` can be whatever you want but should not include spaces or special characters.
    ``` sh
    sh crawl.sh MY_URL MY_ID
    ```
    Once the crawl is finished, a WACZ file will be created in `./crawls/collection/test/MY_ID.wacz`

2. **QA:** Add the `.wacz` file to https://replayweb.page/ to preview it with WebRecorder Playback. (Note: These files do not persist and are *not* a substitute for deposit.)

## Reference resources
- https://github.com/harvard-lil/wacz-exhibitor
- https://lil.law.harvard.edu/blog/2022/09/15/opportunities-and-challenges-of-client-side-playback/
- https://warcembed-demo.lil.tools/
- https://www.sucho.org/browsertrix
- https://cinefiles.bampfa.berkeley.edu/catalog/61386
- https://zinebakery.com/homemade-zines/bakeshop-2-diywebarchiving