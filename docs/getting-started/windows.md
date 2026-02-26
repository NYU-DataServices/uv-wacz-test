# Getting Started – Windows

## 1. Install GitBash

- **What is it?** — GitBash is a Command Line Interface (CLI) Terminal that lets Windows users use Bash commands like Mac/Linux users. It gets installed as part of the GitForWindows package (below).
- **How do I install it?** — Follow the instructions at https://git-scm.com/install/windows and make sure to open the downloaded `.exe` file.

## 2. Install Docker

- **What is it?** — Docker is a "containerization" software. It lets you make a little, fully contained computer within your computer. This is great because you can install more software within the container and it won't mess with other software. You can think of it as a temporary quarantine tent that we'll install and run browsertrix inside of.
- **How do I install it?** — Follow the instructions at https://medium.com/@menukaishan5/install-docker-in-windows-complete-guide-for-the-beginners-b57db6639730. Once installed, start the Docker Desktop app—it needs to be running for the next steps.

## 3. Download the Code Repository

1. Go to the main page of https://github.com/NYU-DataServices/uv-wacz-test and find the green "Code" dropdown button, then select "Download ZIP."
2. Save the ZIP and extract it to your Desktop to make things easy in the next step.

## 4. Access the Code using GitBash
1. Find and open the GitBash app on your computer (It should have been installed in Step 1).
2. Move into the code repository you extracted from the ZIP file using the command `cd ~/Desktop/uv-wacz-test`
    (NOTE: It's also helpful to open that folder in another window so you can see the files/folders as you work.)

## 5. Use the Browsertrix Crawler
1. Download the browsertrix container using the command `docker pull webrecorder/browsertrix-crawler`
2. Run the crawl script (which will use the browsertrix container) by running the command `sh crawl.sh MY_URL` but replace `MY_URL` with the URL of the site you want to crawl (starting with `http://` or `https://`).

## 6. Check results
1. Look for the result in the `/crawls/collections` folder within `uv-wacz-test`. You should see a folder named like the URL and, within it, find a bunch of files including a `MY_URL.wacz` file.
2. Go to https://replayweb.page/ in your browser and upload the `MY_URL.wacz` file to test and QA the result.


