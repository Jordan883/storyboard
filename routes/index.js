const authRoutes = require('./auth');
const usersRoutes = require('./users');
const home = require("./home");

const constructorMethod = (app) => {
  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);
  app.use('/',home)

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;