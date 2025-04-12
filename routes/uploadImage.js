import express from 'express'
import uploadImage from '../controllers/upload-imageController.js';
import multer from 'multer';
import { verifyToken } from '../controllers/authController.js';
import uploadSingleImg  from '../middleware/uploadImages.js';



const router = express.Router();
router.use(verifyToken)
router.post('/', uploadSingleImg('image'), uploadImage);

export default router;
