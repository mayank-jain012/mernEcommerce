import express from 'express'
import { validateCreateRating, validateUpdateRating } from '../middlewares/validator.middleware.js';
import { createRating, updateRating } from '../controller/RatingController.js';
const router=express.Router();

router.post('/create/:id',validateCreateRating,createRating);
router.put('/update/:id',validateUpdateRating,updateRating);
export default router;