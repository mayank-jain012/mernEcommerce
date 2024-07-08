import express from 'express'
import { validateCreateRating } from '../middlewares/validator.middleware.js';
import { createRating } from '../controller/RatingController.js';
const router=express.Router();

router.post('/create/:id',validateCreateRating,createRating);
export default router;