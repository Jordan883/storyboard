const express = require('express');
const { auth } = require('express-openid-connect');
require('dotenv').config()
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: 'http://localhost:3000',
  clientID: 'lBXZAxMM1Ba7xbTDE26VXQWCxjY21XSH',
  issuerBaseURL: 'https://dev-kn-xijmw.us.auth0.com'
};


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', static);
app.use(auth(config));
  // '/login', '/logout', and '/callback' are taken. 
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
