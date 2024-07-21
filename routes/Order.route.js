import express from 'express'
import { createOrder } from '../controller/OrderController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router=express.Router();
router.post('/createOrder',authMiddleware,createOrder);
export default router;