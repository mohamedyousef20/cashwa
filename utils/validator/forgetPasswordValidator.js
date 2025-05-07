import { check } from 'express-validator';
import validator from './validator.js';
import createError from '../error.js';
import User from '../../models/User.js';

const forgetPasswordValidator = [
    check("email")
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .custom(async (val) => {
            const user = await User.findOne({ email: val });
            if (!user) {
                throw new createError('No user found with this email.', 404);
            }
            return true;
        }),

    validator
];

export default forgetPasswordValidator;
