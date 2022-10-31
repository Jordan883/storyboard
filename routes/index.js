const home = require("./home");
const users = require("./users");
const about = require("./about");
const articles = require("./articles");

var xss = require("xss");

const constructorMethod = (app) => {
  // app.uses go here
  app.use("/", home);
  app.use("/users", users);
  app.use("/about",about);
  app.use("/articles", articles)

  app.all("*", (req, res) => {
    res.status(404).json("Error 404: ");
  });
};

module.exports = constructorMethod;
