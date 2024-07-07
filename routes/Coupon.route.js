import express from 'express'
import { createCoupon, deleteCoupon, getACoupon, getCoupon, updateCoupon } from '../controller/CouponController.js';
import { couponValidation } from '../middlewares/validator.middleware.js';
const router=express.Router();
router.post('/create',couponValidation,createCoupon);
router.get('/get',getCoupon);
router.get('/get/:id',getACoupon);
router.delete('/delete/:id',deleteCoupon);
router.put('/update/:id',couponValidation,updateCoupon);
export default router