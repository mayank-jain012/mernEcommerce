import express from 'express'
import { createCoupon, deleteCoupon, getACoupon, getCoupon, getCouponUsage, topCoupon, updateCoupon } from '../controller/CouponController.js';
import { couponValidation } from '../middlewares/validator.middleware.js';
const router=express.Router();
router.post('/create',couponValidation,createCoupon);
router.get('/get',getCoupon);
router.get('/get/:id',getACoupon);
router.get('/coupounUsuage',getCouponUsage);
router.delete('/delete/:id',deleteCoupon);
router.put('/update/:id',couponValidation,updateCoupon);
router.get('/topCoupon',topCoupon);
export default router