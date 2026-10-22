#!/bin/sh

# Usage: ./crawl.sh <url>
# Example: ./crawl.sh https://library.nyu.edu

PURPLE='\033[1;35m'
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NOCOLOR='\033[0m'

show_spinner() {
  target_pid=$1
  spin='|/-'
  i=0

  while kill -0 "$target_pid" 2>/dev/null; do
    i=$(( (i + 1) % 3 ))
    frame=$(printf '%s' "$spin" | cut -c $((i + 1)))
    printf "\r${CYAN}crawl in progress ${frame}${NOCOLOR}"
    sleep 0.1
  done
}

# capture the required URL argument 
# then take the url and extract the URL minus the prefixes to use as the collection name, replacing any non-alphanumeric characters with underscores and removing any leading or trailing underscores
url=$1
collection_name=$(echo $url | sed -E 's#^https?://##' | sed -E 's#[^a-zA-Z0-9]+#_#g' | sed -E 's#^_+|_+$##g') 

# capture optional --config argument
config_arg=""
if [ "$2" = "--config" ] && [ -n "$3" ]; then
  config_arg="--config $3"
fi

# output information about the crawl
echo "\n${PURPLE}archiving $1${NOCOLOR}..."
if [ -n "$config_arg" ]; then
  echo "${PURPLE}using config $3${NOCOLOR}...\n"
fi

# run it
mkdir -p crawls/collections/$collection_name
docker run --rm -v "$(pwd)/crawls:/crawls/" -i webrecorder/browsertrix-crawler crawl --allowHashUrls --url "${url}" --generateWACZ --collection "${collection_name}" ${config_arg} --logLevel error >/dev/null &
docker_pid=$!

show_spinner "$docker_pid"
wait "$docker_pid"
docker_status=$?

if [ "$docker_status" -eq 0 ]; then
  printf "\r${GREEN}crawl completed ✓${NOCOLOR}\n\n"
else
  printf "\r${RED}crawl failed (exit %s) ✗${NOCOLOR}\n\n" "$docker_status" >&2
  exit "$docker_status"
fi
