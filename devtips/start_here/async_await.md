# `async`/`await`

In `mongoConnection.js`, you may notice that we defined our `dbConnection()` function with the `async` keyword. This means that somewhere inside of `dbConnection()`, we have a step that we don't expect to complete instantly. Logically, trying to go through the whole internal process of connecting to the DB is going to take some time for the computer...you can see this on our `MongoClient.connect(...)` step. Because `MongoClient.connect(...)` takes time to do, it is *also* an `async` function!

Unless told otherwise, Javascript will try to complete all of the steps in its functions *instantly*. For `dbConnection()`, this would mean that Javascript tries to run all of the steps inside instantly. It won't wait for `MongoClient.connect(...)` to finish its job, so the function would return a `Pending` value and fail!

To let Javascript know that it needs to wait, we can mark `async` functions that we call with `await`. Using `await` in front of `MongoClient.connect(...)` means that Javascript will *wait* for the function to finish execution before it keeps going with the `dbConnection()` method.

**Important: If you use `await` inside of a function, that function ***also*** becomes `async`.** `dbConnection()` has a step where it needs to wait, and this means that `dbConnection()` will *also* take non-instant time to complete. Therefore, `dbConnection()` ***must also*** be declared as `async`! Otherwise, Javascript will yell at you and refuse to run.

**As a rule of thumb, whenever you need to use `await` inside of a function, that function must also be declared with `async`.**

Because `dbConnection()` is now async, that means that when we use it in `app.js`, we'll need to use `await` when we call it. This now means that our `main` function must *also* be declared `async`.

Really, all that `async` and `await` mean is that a function will take non-instant time to do, and that Javascript should wait to complete the function before it moves on. Other than that, an `async` function behaves the same way as any other normal function, as long as you obey the `async`/`await` syntax rules associated with it.

There's a lot more that goes on behind the scenes in the `async`/`await` system (namely, these things called `Promises`), but we can cross that bridge if we come to it.
