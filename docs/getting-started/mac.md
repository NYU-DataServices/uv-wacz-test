# Getting Started – Mac

> Note: You will need admin access to your computer before getting started.


## 1. Install Docker

- **What is it?** — Docker is a "containerization" software. It lets you make a little, fully contained computer within your computer. This is great because you can install more software within the container and it won't mess with other software. You can think of it as a temporary quarantine tent that we'll install and run browsertrix inside of.
- **How do I install it?** — Follow the instructions at https://docs.docker.com/desktop/setup/install/mac-install/. 

> Note: Once installed, open the Docker Desktop app to statrt it—it needs to be running for the next steps!!

## 2. Download the Code Repository

1. Go to the main page of https://github.com/NYU-DataServices/uv-wacz-test and find the green "Code" dropdown button, then select "Download ZIP."
2. Save the ZIP and extract it to your Desktop. 

    > NOTE: It *must* be on your Desktop for the next steps to work properly.

## 4. Access the Code using Terminal
1. Find and open the Terminal app on your computer.
2. Move into the code repository you extracted from the ZIP file using the command `cd ~/Desktop/uv-wacz-test-main` 
    > (NOTE: It's also helpful to open that folder in another window so you can see the files/folders as you work.)

## 5. Use the Browsertrix Crawler
1. Download the browsertrix container using the command `docker pull webrecorder/browsertrix-crawler`
2. Run the crawl script (which will use the browsertrix container) by running the command `sh crawl.sh MY_URL` but replace `MY_URL` with the URL of the site you want to crawl starting with `http://` or `https://`, e.g., `sh crawl.sh https://maass.nyu.edu/archives`.

## 6. Check results
1. Look for the result in the `/crawls/collections` folder within `uv-wacz-test-main`. You should see a folder named like the URL and, within it, find a bunch of files including a `MY_URL.wacz` file.
2. Go to https://replayweb.page/ in your browser and upload the `MY_URL.wacz` file to test and QA the result.


