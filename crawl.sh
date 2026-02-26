#!/bin/sh

# Usage: ./crawl.sh <url>
# Example: ./crawl.sh https://library.nyu.edu

# take the url and extract the URL minus the prefixes to use as the collection name, replacing any non-alphanumeric characters with underscores
collection_name=$(echo $1 | sed -E 's#^https?://##' | sed -E 's#[^a-zA-Z0-9]+#_#g')
echo "archiving $1 to ./crawls/collections/$collection_name\n\n"

mkdir -p crawls/collections/$collection_name && touch crawls/collections/$collection_name/.gitkeep
docker run --rm -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl --allowHashUrls --url $1 --generateWACZ --collection $collection_name