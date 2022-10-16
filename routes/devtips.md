# `routes`

The routes directory contains the API routing that our app will use. When someone sends a request to our site, it will come in a specific format which contains two key features:

* A URL that specifies our site and where on our site the request wants to look. (The URL can also contain parameters that further specify what the request wants.)
* An *HTTP verb* that also specifies what the request wants. (Some verbs include `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.)

`routes` contains the files that control how our website responds to these requests. You can think of the `routes` directory like our website's "mail room". When a request is sent with a certain URL and verb, the routes directory will catch these properties, perform the right function, and send back the right response.

Usually, a router function will involve calling over a function from the `data` directory to change something with the database, then send back a response to inform the user what happened. For instance, if a user finishes a post and submits it, you may use a router function that calls the *posts* functions from `data` in order to send it to the *posts* part of our MongoDB. Likewise, if a user wants to see a post, you'd use a router function that uses `data`'s *posts* functions (like before), but then *retrieves* post data from MongoDB and sends it back as a response.

In order to do all this, each file in this directory contains *router functions* that control what happens when each URL is reached with a certain verb. These files use ExpressAPI's router to do this.
