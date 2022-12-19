const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const passport = require('./config/passport');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(port, () =>
  console.log(`Clock-in server listening on port ${port}`)
);
