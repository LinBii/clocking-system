const express = require('express');
const router = express.Router();

const passport = require('../config/passport.js');

const home = require('./modules/home');
const userController = require('../controllers/apis/user-controller');

const { authenticated } = require('../middleware/api-auth');

const { apiErrorHandler } = require('../middleware/error-handler');

router.get('/get_current_user', authenticated, userController.getCurrentUser);

router.get('/', authenticated, home);

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.post('/signup', userController.signUp);

router.use('/', apiErrorHandler);

module.exports = router;
