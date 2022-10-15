# `config`

The config directory contains various configuration files for the app as a whole. Right now, this folder contains files that configure mongodb.

## `settings.json`

settings.json contains the url that your mongodb resides at and contains a name for your database. You can name the database whatever you want (I've named it storyboard for our project), and your running url depends on where/how your mongodb is running.

As mentioned on README.md, you may need to change the url contained in settings.json depending on your OS. localhost works best in Linux and Mac, but you may need 127.0.0.1 if you're on a Windows machine.

## `mongoConnection.js`

mongoConnection.js contains a basic function that you run in order to connect your program to your on-computer MongoDB. You shouldn't need to change this file's contents. You just need to run dbConnection() at the start of your main function in app.js.

## `mongoCollections.js`

mongoCollections.js is a file that contains a function to get a collection from your database.

* As we program this site, we're going to be making various collections in Mongo based on the data we want to store. (Users, Posts...etc.) As we create more collections, we need to add them to the bottom of this file in the exports (as shown by the `'sample'` comment).
* Then, over in the `data` directory, we call the collection function (in our case, we'd call `sample()`) whenever we need to access the `sample` collection.
