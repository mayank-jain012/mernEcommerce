import express from 'express'
import { createOrder, payment, trackOrder, updateStatus, cancelOrder, averageOrderValue } from '../controller/OrderController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { updateStatusOrder, validationCreateOrder,cancelOrderStatus } from '../middlewares/validator.middleware.js';
const router = express.Router();
router.post('/createOrder', validationCreateOrder, authMiddleware, createOrder);
router.get('/track/:id', authMiddleware, trackOrder);
router.put('/status/:id', updateStatusOrder, updateStatus);
router.put('/cancel/:id', cancelOrderStatus, cancelOrder);
router.post('/payment', payment);
router.get('/average',averageOrderValue);
export default router;