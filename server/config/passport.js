const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false);

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          if (user.wrongPasswordTimes > 5) {
            return res.status(400).json({
              status: 'error',
              message: '你的帳戶已被封鎖!',
            });
          } else {
            User.increment('wrongPasswordTimes', {
              by: 1,
              where: { id: user.id },
            });
          }
          return done(null, false, { message: '密碼錯誤！' });
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
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

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    User.findByPk(jwtPayload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  })
);

module.exports = passport;
