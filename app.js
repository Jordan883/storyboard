const express = require('express');
const session = require('express-session');
const { auth } = require('express-openid-connect');
require('dotenv').config()
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: 'http://localhost:3000',
  clientID: 'lBXZAxMM1Ba7xbTDE26VXQWCxjY21XSH',
  issuerBaseURL: 'https://dev-kn-xijmw.us.auth0.com'
};

const multer = require('multer')

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

const app = express();

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
      name: '2FAAuthCookie',
      secret: '2FASecret',
      resave: false,
      saveUninitialized: true
  })
);

app.use(auth(config));
  // '/login', '/logout', and '/callback' are taken. 
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});