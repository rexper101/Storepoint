const express = require('express');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  signupValidator,
  loginValidator,
  updatePasswordValidator,
} = require('../validators/authValidators');
const {
  signup,
  login,
  logout,
  updatePassword,
  me,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.put('/password', authenticate, updatePasswordValidator, validate, updatePassword);

module.exports = router;
