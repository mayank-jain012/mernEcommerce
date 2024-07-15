import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Rating } from '../model/ratingSchema.js';
import { Product } from '../model/productSchema.js';
export const createRating = asyncHandler(async (req, res,next) => {
    const product = req.params.id.trim();
    isValidate(product)
    const user = req.user._id
    const { rating, comment } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation error", 501));
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return next(new ApiError([], "", "Rating must be a number between 1 and 5", 400));
    }
    try {

        const rated = await Rating.create({
            product,
            user,
            rating,
            comment
        })

        await rated.save();
        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return next(new ApiError([], "", "Product Not Found", 401));
        }
        productDoc.ratings.push(rated._id);
        const ratings = await Rating.find({ product });
        const totalRating = ratings.length
        const totalRatingSum = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRatingSum / totalRating;
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
        const response = new ApiResponse(rated, 201, "Add Rating success");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})

export const updateRating = asyncHandler(async (req, res, next) => {
    const ratingId = req?.params?.id?.trim();
    const { coment, rating } = req?.body;
    const userId = req?.user?._id;

    isValidate(ratingId)
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation error", 403));
    }
    try {
        const existingRating = await Rating.findById(ratingId)
        if (existingRating.user.toString() !== userId.toString()) {
            return next(new ApiError([], "", "User not authorized to update this rating", 403));
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return next(new ApiError([], "", "Rating must be a number between 1 and 5", 400));
        }
        const product = await Product.findById(existingRating.product)
        if (!product) {
            return next(new ApiError([], "", "Product Not Found", 403));
        }
        product.totalRating = product.totalRating - existingRating.rating + rating;
        product.rating = (typeof (product.totalRating / product.rating.length));
        await product.save();
        existingRating.rating = rating;
        existingRating.comment = coment;
        await existingRating.save();
        const response = new ApiResponse(existingRating, 201, "Update Rating success");
        res.status(201).json(response);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An error occurred", 501))
    }
})

export const deleteRating = asyncHandler(async (req, res, next) => {
    const ratingId = req.params.id.trim();
    const userId = req.user._id;
    isValidate(ratingId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(errors.array, "", "Validation error", 402));
    }

    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
        return next(new ApiError([], "", "Rating not found", 404));
    }
    if (userId.toString() !== existingRating.user.toString()) {
        return next(new ApiError([], "", "User not allowed to delete this rating", 402));
    }
    try {
        const product = await Product.findById(existingRating.product);
        if (!product) {
            return next(new ApiError([], "", "Product not found", 402));
        }
        await existingRating.deleteOne();
        product.ratings.pull(existingRating._id);
        product.totalRating -= existingRating.rating;
        if (product.ratings.length === 0) {
            product.rating = 0;
            product.totalRating = 0;
        } else {
            product.rating = product.totalRating / product.ratings.length;
        }
        await product.save();
        const response = new ApiResponse([], 200, "Rating deleted successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501));
    }
})

export const getRating=asyncHandler(async(req,res,next)=>{
    const productId=req.params.id.trim();
    try {
        const ratings=await Rating.find({product:productId}).populate('user','name').exec();
        const response=new ApiResponse(ratings,200,"Rating Retrieved successfully")
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const analysisRating=asyncHandler(async(req,res,next)=>{
    const productId=req.params.id.trim();
    try {
        const product=await Product.findById(productId).populate("ratings")
        if(!product){

        }
        const ratingDistribution=[0,0,0,0,0]
        let totalRatings=0;
        let sumRatings=0;
        product.ratings.forEach(rating => {
            ratingDistribution[rating.rating - 1]++;
            sumRatings += rating.rating;
            totalRatings++;
          });
        const averageRating=totalRatings ?sumRatings/totalRatings:0;
        const response = new ApiResponse(
            {
              averageRating,
              ratingDistribution,
              totalRatings
            },
            200,
            "Rating analysis retrieved successfully"
          );
          res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const analyzeRatings = asyncHandler(async (req, res, next) => {
    try {
      const products = await Product.find().populate('ratings');
  
      const ratingAnalysis = products.map(product => {
        const ratings = product.ratings;
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings : 0;
  
        const ratingDistribution = [0, 0, 0, 0, 0];
        ratings.forEach(rating => {
          ratingDistribution[rating.rating - 1]++;
        });
  
        return {
          productId: product._id,
          productName: product.name,
          averageRating: averageRating.toFixed(2),
          totalRatings,
          ratingDistribution,
        };
      });
  
      const response = new ApiResponse(ratingAnalysis, 200, "Ratings analysis retrieved successfully");
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(new ApiError([], error.stack, "An error occurred while retrieving ratings analysis", 500));
    }
  });