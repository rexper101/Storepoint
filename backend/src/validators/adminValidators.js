const { body } = require('express-validator');
const { PASSWORD_REGEX } = require('./authValidators');

const createUserValidator = [
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
  body('role')
    .isIn(['admin', 'normal_user', 'store_owner'])
    .withMessage('Role must be admin, normal_user, or store_owner'),
];

const createStoreValidator = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Name is required and must be at most 60 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('address')
    .optional({ checkFalsy: true })
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
  body('ownerId')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('ownerId must be a valid user id'),
];

module.exports = { createUserValidator, createStoreValidator };
