import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Rating } from '../model/ratingSchema.js';
import { Product } from '../model/productSchema.js';

export const createRating = asyncHandler(async (req, res) => {
    const product = req.params.id.trim();
    isValidate(product)
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation error", 501));
    }
    try {
        const{user,rating,comment}=req.body;
        const rated=await Rating.create({
            product,
            user,
            rating,
            comment
        })

        await rated.save();
        const productDoc=await Product.findById(product);
        if(!productDoc){
            return next(new ApiError([],"","Product Not Found",401));
        }
        productDoc.ratings.push(rated._id);
        const ratings=await Rating.find({product});
        const totalRating=ratings.length
        const totalRatingSum=ratings.reduce((sum,rating)=>sum+rating.rating,0);
        const averageRating=totalRatingSum/totalRating;
        const ratingDistribution = {
            1: ratings.filter(r => r.rating === 1).length,
            2: ratings.filter(r => r.rating === 2).length,
            3: ratings.filter(r => r.rating === 3).length,
            4: ratings.filter(r => r.rating === 4).length,
            5: ratings.filter(r => r.rating === 5).length,
        };
        productDoc.totalRating = totalRating;
        productDoc.rating = averageRating;
        productDoc.ratingDistribution = ratingDistribution;
        await productDoc.save();
        const response=new ApiResponse(rated,201,"Add Rating success");
    res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})