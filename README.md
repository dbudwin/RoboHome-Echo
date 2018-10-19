[![Build Status](https://travis-ci.org/dbudwin/RoboHome-Echo.svg?branch=master)](https://travis-ci.org/dbudwin/RoboHome-Echo)
[![Code Climate](https://codeclimate.com/github/dbudwin/RoboHome-Echo/badges/gpa.svg)](https://codeclimate.com/github/dbudwin/RoboHome-Echo)

# RoboHome-Echo

## What Is RoboHome-Echo?

This repo is one of a few repos that make up the whole project.  RoboHome-Echo is the codebase that represents the [Amazon Echo Smart Home Skill AWS Lambda](https://aws.amazon.com/lambda/) of the RoboHome project.  It is a Node.js application that calls the [RoboHome-Web](https://github.com/dbudwin/RoboHome-Web) API to return JSON responses to the AWS Lambda that can perform actions like discovering devices added in the RoboHome-Web application or controlling those same devices.

## What Is the RoboHome Project?

RoboHome is a SaaS tool that also integrates with Amazon's Echo to enable control of semi-connected devices (think IR, and RF) in your house over wifi! This is done using an MQTT pub-sub network to send messages between the website or Echo to a microcontroller like the ESP8266 which has various transmitters hooked up to it (like IR and RF transmitters) to send signals to these devices. This can be used to control RF outlets with lights plugged into them, or to turn on your TV and change channels for instance.

## Developing RoboHome-Echo

### Requirements :white_check_mark:

1. NodeJS 6.10 or 8.10.  These are the versions supported by Amazon for Lambda functions.
2. [RoboHome-Web project](https://github.com/dbudwin/RoboHome-Web).  This is the API that the Lambda function will use to control and query devices.

### Configuring :wrench:

1. Run `npm install` from the root folder to install NPM dependencies.
2. Edit the sample request JSON files to include a valid value for the `token`.  The OAuth 2.0 token can be [generated using Postman](https://www.getpostman.com/docs/v6/postman/sending_api_requests/authorization).
3. Edit the sample request JSON files that have an `endpointId` to have an `endpointId` value that matches a public ID value for a device on RoboHome-Web.

### Testing :100:

1. If using Visual Studio Code, the included `launch.json` has configurations to verify the Lambda function by hitting the RoboHome-Web API.  Select a configuration from the debugger and run it to see the JSON response in the console.  Alternatively, simply run `lambda-local -l index.js -h handler -e <path to request JSON>` on the terminal to see the same response.

## Contributing

### How To Contribute :gift:

Contributions are always welcome!  Please fork this repo and open a PR with your code or feel free to make an issue.  All PRs will need to be reviewed and pass automated checks.  If feedback is given on a PR, please submit updates to the original PR in the form of [fixup! commits](https://robots.thoughtbot.com/autosquashing-git-commits) which will later be squashed before the PR is merged.

This repo supports the principles of [Bob Martin's Clean Code](http://www.goodreads.com/book/show/3735293-clean-code).

### Notes :notebook:

- Update `ROBOHOME_WEB_HOSTNAME` to point to URL of the RoboHome-Web application.
- Update `ROBOHOME_WEB_PORT` to point to port serving the RoboHome-Web API.

*This is a new project and will be changing rapidly, more details will be provided when entering a beta state*
