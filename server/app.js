const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models');

const Clocking = db.Clocking;
const User = db.User;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () =>
  console.log(`Clock-in server listening on port ${port}`)
);
