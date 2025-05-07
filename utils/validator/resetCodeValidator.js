import { check } from 'express-validator';
import validator from './validator.js';

const resetCodeValidation = [
    check('resetCode')
        .notEmpty().withMessage('Verification code is required.')
        .isNumeric().withMessage('Code must be numeric.')
        .isLength({ min: 5, max: 5 }).withMessage('Code must be exactly 5 digits.'),

    validator
];

export default resetCodeValidation;
