# Modules: How Files Work Together

With Node.js, we can have our project files work together as **modules.** A module is a set of code (functions, data, etc.) that you define in one file, and then can export and use in other files. This is almost like classes in other languages.

For our project, we're going to be creating a bunch of different JS files in different directories, and each of these will be a module that is in charge of doing different things. By exporting and importing, we can then use these modules in other files as we need.

For example, in our app, our highest-level file will most likely be `app.js`. In other words, in order to run our site, the first file Node will look at is `app.js`: it should find a `main` method there to execute in order to start the program. The `main` method will have various functions like starting our web server, setting up our API routes, connecting to our database, etc. But, in order to do these things, the `main` method will utilize the functions that we define in *other modules.* For instance, our `config` directory has a file named `mongoConnection.js` which contains a method that connects our program to a database. Instead of reprogramming the connection method inside of `main`, we can *import* the connection method from the `mongoConnection.js` file and then simply call it within `main`.

Organizing our code in this way helps keep everything well-contained and reusable, which makes development much easier!

## `npm`

To run our program, we aren't only going to use modules that *we* create. (Imagine if we had to reprogram the entirety of Mongo's functionality...*yeesh.)* Along with the modules that we create as JS files, we can also add outside modules to our program via `npm`, the *Node Package Manager.*

Over years of web development, lots of developers have programmed and published modules that other programs can download and use. These modules are kept together and managed via npm.

npm helps us keep track of exactly which modules we've downloaded and which modules we need in order to run our program. When you downloaded this program and ran `npm i`, npm checked the `packages.json` file for all of the required modules listed there and automatically installed them for you. (`node_modules` and `package-lock.json` were created via `npm i`!)

Also, whenever you install a module with `npm install [PACKAGENAME]`, the module you download is automatically added to `packages.json`. Then, when others download your code and call `npm i`, they'll also install the module.

In short, npm is a way to get access to important outside JS modules and keep track of all of the module dependencies that our program has.

## How to Implement

To make modules work in our program, we need to use some specific syntax in the JS files that we create.

### Exporting Code

When you've made a JS file (i.e. a *module)* and want to export code from it, you should add `module.exports = {[code]};` to the bottom of your file. Inside of the curly brackets, you would list things like method names, data structures, etc. that you've defined inside of your code.

Take a look at `mongoConnection.js`, for example. Inside of our `module.exports = {[code]};`, we've defined two functions: `dbConnection` and `closeConnection`. This means that if we *import* `mongoConnection.js` into another file as a module, we'll be able to use `dbConnection` and `closeConnection` there.

### Side Note: Syntax in `mongoConnection.js`

In `mongoConnection.js`, we've written down the function names followed by a colon, and then defined the functions immediately after. This is fine in Javascript because the curly brackets define a Javascript ***Object***, which is a set of key-value pairs. The keys are the function names; the values are how we've defined each function.

An alternative approach would be to name and define each of the functions outside of the brackets, and then simply list the function names within the brackets, separated by commas. This approach is also fine because Javascript will parse the listed function names into key value pairs, just like the first approach.

Also note that in `mongoConnection.js`, we've made use of [*arrow functions*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions "MDN Arrow Functions Documentation") in our function definitions. It will be helpful to read about these more because you're going to see a lot of them in Javascript programming.

### Importing Code

In order to *import* code from a module into another file, you should use the `require()` function at the top of the file. `require()` takes in a path to the file you want to import, then returns a reference to an *object* which contains all of the things that the file exported.

For instance, take a look at `app.js`. I've placed an initial `require()` statement there that imports things from `mongoConnection.js`. (I expect that we'll need `mongoConnection.js` in our `main` function anyway, so we'll likely be keeping this requirement!)

I declare a `const` variable `connection`, which equals the return from my `require` function. Inside of `require`, I place the path from `app.js` to `mongoConnection.js` as a string. (Most `require` calls should use a [*relative* file path.](https://www.w3schools.com/html/html_filepaths.asp, "File Paths (W3Schools)")) Then, `require` looks for the file defined by my path, grabs its `module.exports`, and returns it into the `connection` variable.

Then, when I want to use functions from `mongoConnection.js` in my code, I can refer to the `connection` variable and call the functions I want. For instance, if I want to get a connection to our database, I'll say `connection.dbConnection()`. (I would *actually* say ***`await`*** `connection.dbConnection()`; see the note below.)

### Side Note: `async`/`await`

There's one more thing I should mention! Back in `mongoConnection.js`, you may have noticed that we defined our `dbConnection()` function with the `async` keyword. This means we'll have to use some special syntax when we're using the function in `app.js`. Check out `async_await.md` for more information.

### Putting it Together

So in total, in order to shoot code between modules, you need to do two things:

* In the module file, you need to *export* the code via `module.exports = {[code]}`
* In your receiving file, you need to *import* the code from the module via `const myModule = require('<path>')`

This network is the main structure that our program will take. We'll be defining specific sets of code within various module files, and then use exports and imports so that we can re-use that code in the areas that we need it.
