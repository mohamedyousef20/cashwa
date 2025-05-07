import express from 'express';
import { verifyToken } from '../controllers/authController.js';
import { getUserHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', verifyToken, getUserHistory);


export default router;