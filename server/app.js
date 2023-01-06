const express = require('express');
const session = require('express-session');
const cors = require('cors');
const schedule = require('node-schedule');
const routes = require('./routes');
const passport = require('./config/passport');
const { sendAbsentUserEmail } = require('./email/emailScheduler');
const app = express();
const port = process.env.PORT || 3000;

schedule.scheduleJob('00 5 * * *', function () {
  console.log('Send the mail at ' + new Date());
  sendAbsentUserEmail();
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes, (req, res) => {
  res.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.append('Access-Control-Allow-Origin', 'https://punchin.fly.dev');
});

app.listen(port, () =>
  console.log(`Clock-in server listening on port ${port}`)
);
