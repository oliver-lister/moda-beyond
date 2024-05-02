# MØDA-BEYOND E-Commerce Store

A full-stack e-commerce store.

Brief description of what the website does and its purpose.

## Table of Contents

Features
Installation
Usage
Technologies Used
Contributing
License
Features
List of key features of the website.

## Setup

### Run Frontend Locally using the Render-hosted Backend

Unfortunately you <b>cannot</b> run the backend locally at full functionality without the keys and secrets in my backend's .env file which is ignored by git.

To avoid problems, I recommend running the frontend in production mode via the below commands:

    cd frontend // change directory into frontend folder
    npm install // install dependencies
    npm run build // run build
    npx vite preview // expose the build on a localhost port for viewing

This will connect your frontend running on your localhost server with the backend hosted by <a href="https://render.com/">render</a>.

_Note: The frontend is currently pointed to a backend hosted by <a href="https://render.com/">render</a> on a free instance. This means it will spin down with inactivity, which can delay requests by 50 seconds or more. Please allow a minute for the backend to warmup on start-up before testing any functionality._

### Admin (Custom CMS)

The same situation presents itself with the admin frontend, again please run it in production mode via the below commands

    cd admin // change directory into frontend folder
    npm install // install dependencies
    npm run build // run build
    npx vite preview // expose the build on a localhost port for viewing

## Usage

Instructions on how to use the website, including any user interfaces or commands.

Technologies Used
List of technologies, frameworks, and languages used to build the website.

Contributing
Guidelines on how to contribute to the website, including information on how to report bugs or suggest improvements.

License
Information about the license under which the website is distributed, including any terms and conditions.

## Authors

Oliver Lister - Creator

## Acknowledgements

Any acknowledgements or credits for third-party resources, libraries, or inspiration.
