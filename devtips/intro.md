# Project Intro

Hi everyone! Welcome to the Storyboard project. Whether you're new to web programming or experienced, we're all here to learn and have fun (and practice Agile development, most of all). I'm looking forward to working together!

## How Websites Work

For this project, we'll be programming a blog-based website. First, let's take a quick primer on how websites work.

On your browser, when you go to a URL, you are contacting a specific website to give you some information. The URL is basically an *address* to a specific location on a specific computer. (This computer is where the website is stored! It could be some massive server, or a personal computer, in our case.) Once you've contacted the computer, it will look at the request that you gave it, then send back some information (such as a webpage). Thus, the computer is called a *web server.* You contact the server via the URL, and it "serves back" some information.

## Anatomy of a Website/The MERN Stack

To make a website, there are a few basic parts you'll need:

### The Backend

Every website has a **backend.** The backend is made of code that exists on the web server and runs there. The backend code *"is"* the website, so to speak. When a web browser makes a request to our website, our backend is what responds to the request. It's sort of the glue that holds everything together.

In order to have a backend, we need to have some kind of code running on our computer that can receive and respond to requests. For our project, we'll be using **Node.js.** In effect, all that Node does is let us run Javascript on our computer. (Normally, you'd have to use a browser to run Javascript...Node lets us run JS on our computers in the same way as Python or Java.) Therefore we can program Javascript and keep it running on our computer, and it will act as a backend!

### Side Note: `npm`

Another great feature of Node.js is the *Node Package Manager,* or *npm.* Over years of web development, lots of developers have programmed packages for Javascript in order to expand its functionality or help handle difficult tasks. These libraries are kept together and managed via npm, which allows us to download packages for use in our program. (In fact, the rest of our site's anatomy is controlled by these packages!)

npm also helps us keep track of exactly which packages we've downloaded and which packages we need in order to run our program. When you downloaded this program and ran `npm i`, npm checked the `packages.json` file for all of the required packages listed there and automatically installed them for you. (`node_modules` and `package-lock.json` were created via `npm i`!)

Also, whenever you install a package with `npm install [PACKAGENAME]`, the package you download is automatically added to `packages.json`. Then, when others download your code and call `npm i`, they'll also install the package.

In short, npm is a way to get access to important JS packages and keep track of all of the package dependencies that our program has.

### The Database

Moving back to our site anatomy, most websites also need a **database.** The database is the "long-term storage" for our website. If we want our website to *keep* any data inside of it (i.e. users or posts), we'll need a database to store it.

For our website, we'll be using **MongoDB.** Mongo is a super-flexible database that's relatively easy to pick up once you have a good understanding of objects in Javascript. Basically, Mongo stores data as *documents* (i.e. JSON format) that work in the exact same way that objects do in Javascript. So once you understand JS objects, Mongo isn't too far off from it.

To work with MongoDB, you'll need to [install and run it on your machine.](https://www.mongodb.com/docs/manual/installation/ "MongoDB Install/Run Tutorial"). Then, in the backend, you can interact with it using the mongodb package from npm.

MongoDB can be a bit finicky at times! If you ever have any questions or need help with Mongo, ping me in Slack and we can work through it together :D

### The API

Websites use an *application programming interface* **(API)** to handle incoming requests and send back responses. When a request is sent to our site, it will come in a specific format which contains two key features:

* A URL that specifies our site and where on our site the request wants to look. (The URL can also contain parameters that further specify what the request wants.)
* An *HTTP verb* that also specifies what the request wants. (Some verbs include `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.)

(Technically, a request contains a bunch of other parts, but these two are the most important for now.)

Our API's job is to decode these requests and then send back an appropriate response. Our responses will usually include:

* A *response code* that summarizes what happened. Codes generally fall in the following ranges:
  * 200s: Response successful (OK)
  * 300s: Need to redirect from this point
  * 400s: Client-side error
  * 500s: Server-side error
* A response body. This could be code for a webpage or could be other data we want to send.
* *(We can also include headers (metadata), but this is optional.)*

We'll be using **Express API** for our site. Express API is a npm package that let you take in requests, decode them by URL and verb, and respond with some resource (such as a web page).

### The Frontend

Of course, the last thing that every website needs is a **frontend.** The frontend is what makes a website a website: it contains all of the visible resources, like webpages, that the user sees when interacting with your site.

To construct our frontend, we'll use **React.** With React, we'll be able to construct webpages completely within the realm of Javascript! We program in JS, and React renders it into actual webpages. (This is a much nicer alternative than having to do lots of HTML and CSS work to manually create the pages. However, knowing about HTML and CSS may be helpful as we program these, just in case.)

I'm not as experienced/confident in React as with the other parts of our site. I'll add information here as we continue development.

### Side Note: `tailwind.css`

**Tailwind.css** could be another helpful tool when designing our website. It greatly simplifies/streamlines the process of web styling via css. Like React, I'm not as experienced with this service, so I'll add more info here as it comes in.

### Putting it Together

In total, the main set of tech (or *"tech stack"*) that we'll be using is **M**ongoDB, **E**xpress API, **R**eact, and **N**ode.js. Thus, we're using the **MERN** stack!
