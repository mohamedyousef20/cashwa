import { check } from 'express-validator';
import validator from './validator.js';
import createError from '../error.js';
import User from '../../models/User.js';

const forgetPasswordValidator = [
    check("email")
    .notEmpty()
    .withMessage('email is required ').
    isEmail()
    .withMessage('invalid email').custom(async(val,{req}) => {
              
             await User.findOne({ email: val }).then((user) => {
                    if (!user) {
                    return Promise.reject(new createError('No User Belong To This Email',404))
                    }
                })
            }),
validator
]
export default forgetPasswordValidator