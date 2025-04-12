import { check } from 'express-validator';
import slugify from 'slugify';
import User from '../../models/User.js';
import createError from '../error.js';
import validator from './validator.js'

 export const authValidator = [
   check('username').notEmpty().withMessage('User name is required.. ')
     .isLength({ min: 3 }).withMessage('User name At Least Three Letters.. ')

        .custom((val, { req }) => req.body.slug = slugify(val)),

    check("email")
        .notEmpty()
        .withMessage('email is required.. ').
        isEmail()
        .withMessage('invalid email')
        .custom(async(val,{req}) => {
          
         await User.findOne({ email: val }).then((user) => {
                if (user) {
                return Promise.reject(new createError('invalid email its belong to another user',501))
                }
            })
        })
    
    ,
    check('password').notEmpty().withMessage('password is required ')
        .isLength({ min: 6 }).withMessage("too short password").custom((val, { req }) => {
           
            if (val != req.body.passwordConfirm) {
           throw (new createError('password dose not match',401))
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
export default authValidator