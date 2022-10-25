# Storyboard

[![.github/workflows/node.js.yml](https://github.com/Jordan883/storyboard/actions/workflows/node.js.yml/badge.svg)](https://github.com/Jordan883/storyboard/actions/workflows/node.js.yml)

A story-writing app where kids can share their writing and parents can moderate content. Project for CS-555.

## Installation/How To Run

### Dependencies

Before downloading this program, you'll need to install the following items to your computer:

- [git](https://git-scm.com/downloads "Git Installation")
- [MongoDB](https://www.mongodb.com/docs/manual/installation/ "MongoDB Install/Run Tutorial")
- [Node.js](https://nodejs.org/en/ "Node.js Installation")

### Downloading/Running the Program

#### Download

1. _git clone_ this repo to your computer.
2. On the command line, go to the repo folder and run _npm i._

#### Run

1. If MongoDB is not running, turn it on.(**_MongoDB must be running on your machine before you can use the website._** If you installed MongoDB as a service, it will always run in the background, but otherwise, you need to run it manually.)
2. Run _npm start_ to start the web server on your computer.
3. Follow the output instructions to see the website.

## Tips/Debugs

- Under config/settings.json, you may need to change the serverURL to localhost (instead of 127.0.0.1). Generally, 127.0.0.1 works for Windows; localhost works for other OS.

## Developer Tips

- Earlier, we used a system of devtips.md markdown files to hel document this program and some code tips. We've now moved these files to the [storyboard GitHub wiki!](https://github.com/Jordan883/storyboard/wiki "storyboard Github wiki")
- We're all here to learn and have fun doing it. If you have any questions, feel free to ping me on Slack. Good luck and happy programming! - Jordan :)
