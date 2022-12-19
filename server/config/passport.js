const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const db = require('../models');
const User = db.User;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password).then((res) => {
          if (!res) return done(null, false);
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      return done(null, user.toJSON());
    })
    .catch((err) => done(err));
});

module.exports = passport;
