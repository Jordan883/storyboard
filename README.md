# Storyboard

A story-writing app where kids can share their writing and parents can moderate content. Project for CS-555.

## Installation/How To Run

### Dependencies

Before downloading this program, you'll need to install the following items to your computer:

* [git](https://git-scm.com/downloads "Git Installation")
* [MongoDB](https://www.mongodb.com/docs/manual/installation/ "MongoDB Install/Run Tutorial")
* [Node.js](https://nodejs.org/en/ "Node.js Installation")

### Downloading/Running the Program

#### Download

1. *git clone* this repo to your computer.
2. On the command line, go to the repo folder and run *npm i.*

#### Run

1. If MongoDB is not running, turn it on.(***MongoDB must be running on your machine before you can use the website.*** If you installed MongoDB as a service, it will always run in the background, but otherwise, you need to run it manually.)
2. Run *npm start* to start the web server on your computer.
3. Follow the output instructions to see the website.

## Tips/Debugs

* Under config/settings.json, you may need to change the serverURL to localhost (instead of 127.0.0.1). Generally, 127.0.0.1 works for Windows; localhost works for other OS.

## Developer Tips

* I've placed a devtips.md file in each directory to explain what it does and what should go there. Checking those will be helpful for understanding how this site should be developed. I'll add more to the docs as I learn more/review some web code.
* I've also created a devtips directory where I'll keep my more general notes on web development/the project.
* We're all here to learn and have fun doing it. If you have any questions, feel free to ping me on Slack. Good luck and happy programming! - Jordan :)
