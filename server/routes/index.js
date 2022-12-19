const express = require('express');
const router = express.Router();

const passport = require('../config/passport.js');

const home = require('./modules/home');
const userController = require('../controllers/apis/user-controller');

const { apiErrorHandler } = require('../middleware/error-handler');

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.post('/signup', userController.signUp);

router.use('/', home, apiErrorHandler);

module.exports = router;
