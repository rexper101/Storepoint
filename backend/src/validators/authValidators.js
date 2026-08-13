const { body } = require('express-validator');

// 8-16 chars, at least one uppercase letter and one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

const signupValidator = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('address')
    .optional({ checkFalsy: true })
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character (!@#$%^&*)'
    ),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'New password must be 8-16 characters and include at least one uppercase letter and one special character (!@#$%^&*)'
    ),
];

module.exports = {
  signupValidator,
  loginValidator,
  updatePasswordValidator,
  PASSWORD_REGEX,
};
