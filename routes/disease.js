// routes/diseaseRoutes.js
import express from 'express';
import { getDisease } from '../controllers/diseaseController.js';

const router = express.Router();

// نقاط النهاية لنموذج المرض
// router.route('/')
//     .post(createDisease)   // إنشاء مرض جديد
//     .get(getDiseases);     // جلب كل الأمراض

router.route('/')
    .get(getDisease)       // جلب مرض معين بواسطة الـ ID
// .put(updateDisease)    // تحديث المرض
// .delete(deleteDisease); // حذف المرض

export default router;
