const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();

const passport = require('../config/passport.js');

const userController = require('../controllers/apis/user-controller');

const { authenticated } = require('../middleware/api-auth');

const { apiErrorHandler } = require('../middleware/error-handler');

router.get('/get_current_user', authenticated, userController.getCurrentUser);

router.put(
  '/users/:id',
  authenticated,
  upload.array(),
  userController.updatePassword
);

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.post('/signup', userController.signUp);

router.use('/', apiErrorHandler);

module.exports = router;
