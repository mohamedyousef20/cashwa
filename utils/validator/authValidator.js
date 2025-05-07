import { check } from 'express-validator';
import slugify from 'slugify';
import User from '../../models/User.js';
import createError from '../error.js';
import validator from './validator.js';

// ========== REGISTER VALIDATOR ==========
export const authValidator = [
  check('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new createError('This email already belongs to another user.', 400);
      }
      return true;
    }),

  check('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new createError('Passwords do not match.', 400);
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty().withMessage('Password confirmation is required.'),

  validator
];

// ========== LOGIN VALIDATOR ==========
export const loginValidator = [
  check('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (!user) {
        throw new createError('Wrong email or password.', 400);
      }
      return true;
    }),

  check('password')
    .notEmpty().withMessage('Password is required.'),

  validator
];

export default authValidator;
