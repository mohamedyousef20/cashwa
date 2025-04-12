import { check } from 'express-validator';
import bcrypt from 'bcrypt'
import validator from './validator.js';
import slugify from 'slugify';
import createError from '../error.js';
import User from '../../models/User.js';




export const updateUserValidator = [
    check('name').optional().isString().withMessage('invalid User name')
        .isLength({ min: 3 }).withMessage("Too Short User Name")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    check("email")
        .optional()
        .notEmpty()
        .withMessage('email is required ').
        isEmail()
        .withMessage('invalid email'),

    validator

];
export const updateLoggedUserValidator = [
    check('name').optional().isString()
        .withMessage('invalid User name')
        .isLength({ min: 3 })
        .withMessage("Too Short User Name")
        .custom((val, { req }) => req.body.slug = slugify(val)),

    check('email').optional().custom(async (val) => {
        return await User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new createError('Email already in use', 400));
            }
        });
    }),
    validator

];




export const deleteUserValidator = [
    check('id').isMongoId().withMessage('invalid User ID'),
    validator

];

export const changePasswordValidator = [


    check('password')
        .isLength({ min: 6 }).withMessage("Password Is Not Correct")
        .notEmpty().withMessage('Password Is Required')
        .custom(async (val, { req }) => {

            const user = await User.findById(req.user._id);
            if (!user) {
                throw new createError('No User Found', 501);
            }
            const passwordIsCorrect = await bcrypt.compare(val, user.password);

            if (!passwordIsCorrect) {
                throw new createError('password Is Not Correct')

            }



            return true;
        }),

    check('newPassword').notEmpty().withMessage('newPassword is required'),

    check('confirmPassword').notEmpty().withMessage('passwordConfirm is required').custom((val, { req }) => {
        if (val != req.body.newPassword) {
            throw new createError('password and Password confirm is not matching')
        }
        return true;
    }),

    validator
]