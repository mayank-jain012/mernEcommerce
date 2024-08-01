import express from 'express';
const router=express.Router();
import { getSaleByDate } from '../middlewares/validator.middleware.js';
import { getSalesByDate ,getSaleByProductId, overView, getSalesByColor, getSalesByBrand} from '../controller/SalesController.js';

router.get('/getSalebyColor',getSalesByColor);
router.get('/getSalebyBrand',getSalesByBrand);
router.get('/getSalesDate',getSaleByDate,getSalesByDate);
router.get('/getSales/:id',getSaleByProductId);
 router.get('/overView',overView);
export default router;