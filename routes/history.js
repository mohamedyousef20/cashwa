import express from 'express'
import { getUserHistory } from '../controllers/historyController.js';
import { verifyToken } from '../controllers/authController.js';



const router = express.Router();
router.use(verifyToken)
router.get('/' ,getUserHistory);

export default router;
