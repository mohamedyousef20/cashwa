import express from 'express'
import uploadImage, { createDetectImg, resizeImage } from '../controllers/upload-imageController.js';
import { verifyToken } from '../controllers/authController.js';


const router = express.Router();
router.use(verifyToken)
router.post('/', createDetectImg, resizeImage, uploadImage);

export default router;
