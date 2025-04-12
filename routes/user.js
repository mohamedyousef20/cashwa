import express from 'express'
import { verifyToken } from "../controllers/authController.js"
import {
    // createUserValidator,
    updateUserValidator,
    // deleteUserValidator,
    changePasswordValidator,
    // updateLoggedUserValidator,

} from '../utils/validator/userValidator.js'
import {

    getUser,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteMyAccount,
    createUserImg,
    resizeImage
} from "../controllers/userController.js";

const router = express.Router();

// logged user 
router.use(verifyToken)
router.get('/getData/getMe', getUser);
router.patch('/changeMyPassword', changePasswordValidator, updateLoggedUserPassword);
router.patch('/updateUserData', createUserImg, resizeImage, updateUserValidator, updateLoggedUserData)
router.delete("/deleteMyAccount", deleteMyAccount);



export default router