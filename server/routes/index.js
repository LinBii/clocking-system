const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const passport = require('../config/passport.js');

const attendanceController = require('../controllers/apis/attendance-controller');
const userController = require('../controllers/apis/user-controller');
const adminController = require('../controllers/apis/admin-controller');

const authenticated = passport.authenticate('jwt', { session: false });
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return next();
    }
    return res.json({ status: 'error', message: '禁止存取！' });
  } else {
    return res.json({ status: 'error', message: '禁止存取！' });
  }
};

const { apiErrorHandler } = require('../middleware/error-handler');
const { sendEmail } = require('../email/nodemailer.js');

router.get('/get_current_user', authenticated, userController.getCurrentUser);

router.post('/attendances', authenticated, attendanceController.postAttendance);
router.put(
  '/attendances/:id',
  authenticated,
  attendanceController.updateAttendance
);

router.put(
  '/users/:id',
  authenticated,
  upload.array(),
  userController.updatePassword
);

router.get(
  '/admin/attendances',
  authenticated,
  authenticatedAdmin,
  adminController.getAttendances
);
router.put(
  '/admin/attendances/:id',
  authenticated,
  authenticatedAdmin,
  adminController.putAbsence
);
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
);
router.get(
  '/admin/users/absent',
  authenticated,
  authenticatedAdmin,
  adminController.getAbsentUsers
);
router.put(
  '/admin/users/:id',
  authenticated,
  authenticatedAdmin,
  adminController.unlockUser
);

router.get('/email', (req, res) => {
  sendEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);

router.use('/', apiErrorHandler);

module.exports = router;
