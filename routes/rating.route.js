import express from 'express'
import { validateCreateRating, validateDeleteRating, validateUpdateRating } from '../middlewares/validator.middleware.js';
import { analysisRating, analyzeRatings, createRating, deleteRating, getRating, updateRating } from '../controller/RatingController.js';
import {authMiddleware} from '../middlewares/auth.middleware.js'
const router=express.Router();

router.post('/create/:id',authMiddleware,validateCreateRating,createRating);
router.put('/update/:id',authMiddleware,validateUpdateRating,updateRating);
router.delete('/delete/:id',authMiddleware,validateDeleteRating,deleteRating);
router.get('/get/:id',getRating);
router.get('/analysis/:id',analysisRating);
router.get('/analysis',analyzeRatings)
export default router;