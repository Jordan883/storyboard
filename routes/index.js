const authRoutes = require('./auth');
const usersRoutes = require('./users');
const homeRoutes = require("./home");
const aboutRoutes = require("./about");
const articlesRoutes = require("./articles");

var xss = require("xss");

const constructorMethod = (app) => {
  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);
  app.use("/", homeRoutes);
  app.use("/about",aboutRoutes);
  app.use("/articles", articlesRoutes)

  app.all("*", (req, res) => {
    res.status(404).json("Error 404: ");
  });
};

module.exports = constructorMethod;
