[![Build Status](https://travis-ci.org/dbudwin/RoboHome-Echo.svg?branch=master)](https://travis-ci.org/dbudwin/RoboHome-Echo)
[![Code Climate](https://codeclimate.com/github/dbudwin/RoboHome-Echo/badges/gpa.svg)](https://codeclimate.com/github/dbudwin/RoboHome-Echo)

# RoboHome-Echo

## What Is RoboHome-Echo?

This repo is one of a few repos that make up the whole project.  RoboHome-Echo is the codebase that represents the Amazon Echo Smart Home Skill of the RoboHome project.  It is a Node.js application that can discover and control devices added as part of the [RoboHome-Web](https://github.com/dbudwin/RoboHome-Web) project.

## What Is the RoboHome Project?

RoboHome is a SaaS tool that also integrates with Amazon's Echo to enable control of semi-connected devices (think IR, and RF) in your house over wifi! This is done using an MQTT pub-sub network to send messages between the website or Echo to a microcontroller like the ESP8266 which has various transmitters hooked up to it (like IR and RF transmitters) to send signals to these devices. This can be used to control RF outlets with lights plugged into them, or to turn on your TV and change channels for instance.

## Contributing

### How To Contribute :gift:

Contributions are always welcome!  Please fork this repo and open a PR with your code or feel free to make an issue.  All PRs will need to be reviewed and pass automated checks.  If feedback is given on a PR, please submit updates to the original PR in the form of [fixup! commits](https://robots.thoughtbot.com/autosquashing-git-commits) which will later be squashed before the PR is merged.

This repo supports the principles of [Bob Martin's Clean Code](http://www.goodreads.com/book/show/3735293-clean-code).

### Notes :notebook:

- Update `ROBOHOME_WEB_HOSTNAME` to point to locations on your server.


*This is a new project and will be changing rapidly, more details will be provided when entering a beta state*

