import { addWishlist, getWishlist, removeWishlist } from "../controller/WishListController.js";
import { validateRemoveFromWishlist, validationWishlist } from "../middlewares/validator.middleware.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'
import express from 'express'
const router=express.Router();
router.post("/create",authMiddleware,validationWishlist,addWishlist);
router.get('/get',authMiddleware,getWishlist);
router.delete('/remove',authMiddleware,validateRemoveFromWishlist,removeWishlist);
export default router;