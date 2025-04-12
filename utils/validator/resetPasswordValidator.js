import { check } from 'express-validator';
import validator from './validator.js';
import createError from '../error.js';
import User from '../../models/User.js';


export const resetPasswordValidator = [
    check("email")
        .notEmpty()
        .withMessage('email is required ').
        isEmail()
        .withMessage('invalid email').custom(async (val, { req }) => {

            await User.findOne({ email: val }).then((user) => {
                if (!user) {
                    return Promise.reject(new createError('No User Belong To This Email', 404))
                }
            })
        }),
    check('newPassword').notEmpty().withMessage('newPassword is required ')
        .isLength({ min: 6 }).withMessage("too short password").custom((val, { req }) => {

            if (val != req.body.passwordConfirm) {
                throw (new createError('password dose not match', 401))
            }
            return true;
        }),
    check('passwordConfirm').notEmpty().withMessage('password confirm is required'),
    validator
];


export const loginValidator = [
    check('email')
        .isEmail()
        .withMessage('invalid email')
        .notEmpty()
        .withMessage('email is required')

        .custom(async (val, { req }) => {
            await User.findOne({ email: val }).then((user) => {
                if (!user) {
                    return Promise.reject(new createError("Wrong email or password", 400));
                }
            });
        }),

    check("password")
        .notEmpty(),
    validator
];
export default resetPasswordValidator