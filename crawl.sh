#!/bin/sh

echo "archiving $1 to ./crawls/collections/$2"
docker run --rm -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl --allowHashUrls --url $1 --generateWACZ --collection $2
