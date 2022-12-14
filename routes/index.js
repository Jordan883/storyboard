const userData = require('../data/users');
const familyData = require('../data/families');
const usersRoutes = require('./users');
const homeRoutes = require("./home");
const aboutRoutes = require("./about");
const articlesRoutes = require("./articles");
const articlesListRoutes = require("./articlesList");

const constructorMethod = (app) => {
  app.use('/users', usersRoutes);
  app.use("/", homeRoutes);
  app.use("/about",aboutRoutes);
  app.use("/articles", articlesRoutes)
  app.use("/articlesList", articlesListRoutes)

  app.all("*", (req, res) => {
    res.status(404).json("Error 404: ");
  });
};

module.exports = constructorMethod;