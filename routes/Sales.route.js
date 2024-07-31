import express from 'express';
const router=express.Router();
import { getAllSales } from '../controller/SalesController.js';
router.get('/getAllSales',getAllSales);
export default router;