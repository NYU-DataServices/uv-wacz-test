#!/bin/sh

echo "archiving $1 to ./crawls/collections/$2"
mkdir -p crawls/collections/$2 && touch crawls/collections/$2/.gitkeep
docker run --rm -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl --allowHashUrls --url $1 --generateWACZ --collection $2

