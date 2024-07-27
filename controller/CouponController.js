import { asyncHandler } from '../utils/asyncHandler.js'
import { Coupon } from '../model/couponModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../model/userSchema.js';
import { validationResult } from 'express-validator'
import { isValidate } from '../utils/mongodbValidate.js';

export const createCoupon = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(new ApiError([], errors.array, "Validation Error", 402));
    }
    const { code, discount, expiry } = req?.body;
    try {
        const coupon = await Coupon.findOne({ code });
        if (coupon) {
            return next(new ApiError([], "", "Coupon Already Exist", 402));
        }
        const parsedExpiry = new Date(expiry);
        if (isNaN(parsedExpiry)) {
            return next(new ApiError([], '', 'Invalid date format', 400));
        }
        const data = await Coupon.create({
            code,
            discount,
            expiry: parsedExpiry
        })
        await data.save();
        const response = new ApiResponse(data, 201, "Coupon Created Succesfully")
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
export const getCoupon = asyncHandler(async (req, res, next) => {
    try {
        const coupon = await Coupon.find();
        if (!coupon) {
            return next([], "", "No Coupon Exist", 402);
        }
        const response = new ApiResponse(coupon, 201, "Get All Coupon")
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
export const getACoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return next(new ApiError([], "", "Coupon not exist", 402))
        }
        const response = new ApiResponse(coupon, 201, "Coupon found")
        res.status(201).json(response)
    } catch (error) {
        next(new ApiError([], error.stack, "An error Occurred", 501))
    }
})
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    const { expiry, code, discount,isActive } = req?.body
    try {
       
        const coupon = await Coupon.findByIdAndUpdate(
            id,
            {
                expiry,
                code,
                discount,
                isActive
            },{
                new:true,
                runValidators:true
            });
        if (!coupon) {
            return next(new ApiError([], "", "Coupon not exist", 402))
        }
        const response = new ApiResponse(coupon, 201, "Coupon updated Successfully")
        res.status(201).json(response)
    } catch (error) {
        next(new ApiError([], error.stack, "An error Occurred", 501))
    }
})
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    try {
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) {
            return next(new ApiError([], "", "Coupon not exist", 402))
        }
        const response = new ApiResponse(coupon, 201, "Coupon Deleted");
        res.status(201).json(response)
    } catch (error) {
        next(new ApiError([], error.stack, "An error Occurred", 501))
    }
})
// get top coupon 
export const topCoupon=asyncHandler(async(req,res,next)=>{
})
// get coupon usuage
export const couponUsuage=asyncHandler(async(req,res,next)=>{
})