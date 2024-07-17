import express from 'express';
import {authMiddleware} from "../middlewares/auth.middleware.js"
import { addToCart, updateQuantity,removeCart,applyCoupon,getCart } from '../controller/CartController.js';
import { validationApplyCouponCart, validationCreateCart, validationRemoveCart } from '../middlewares/validator.middleware.js';
const router=express.Router();

router.post("/create",authMiddleware,validationCreateCart,addToCart);
router.put("/update",authMiddleware,validationCreateCart,updateQuantity);
router.delete('/delete',authMiddleware,validationRemoveCart,removeCart);
router.get('/get',authMiddleware,getCart);
router.post('/applyCoupon',authMiddleware,validationApplyCouponCart,applyCoupon);
export default router;