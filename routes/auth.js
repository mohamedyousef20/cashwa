import express from 'express'
import multer from 'multer';
import { login, register, verifyToken } from '../controllers/authController.js';
import authValidator, { loginValidator } from '../utils/validator/authValidator.js';
import { forgetPassword, resetPassword, verifyResetCode } from '../controllers/forgetPasswordController.js';
import forgetPasswordValidator from '../utils/validator/forgetPasswordValidator.js';
import resetPasswordValidator from '../utils/validator/resetPasswordValidator.js';
import resetCodeValidation from '../utils/validator/resetCodeValidator.js';



const router = express.Router();

router.post('/register', authValidator, register);
router.post('/login', loginValidator, login);
router.post("/forgetPassword",forgetPasswordValidator ,forgetPassword);
router.post('/verifyResetCode', resetCodeValidation ,verifyResetCode);
router.post('/resetPassword', resetPasswordValidator, resetPassword);


export default router;
