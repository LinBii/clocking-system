const express = require('express');
const router = express.Router();
const home = require('./modules/home');
const userController = require('../controllers/user-controller');
const { apiErrorHandler } = require('../middleware/error-handler');

router.post('/signup', userController.signUp);

router.use('/', home, apiErrorHandler);

module.exports = router;
