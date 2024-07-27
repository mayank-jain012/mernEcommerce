import express from 'express'
import { createOrder, payment, trackOrder } from '../controller/OrderController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validationCreateOrder } from '../middlewares/validator.middleware.js';
const router=express.Router();
router.post('/createOrder',validationCreateOrder,authMiddleware,createOrder);
router.get('/track/:id',authMiddleware,trackOrder)
router.post('/payment',payment);
export default router;