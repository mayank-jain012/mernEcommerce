import { asyncHandler } from '../utils/asyncHandler.js'
import { Coupon } from '../model/couponModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../model/userSchema.js';
import { validationResult } from 'express-validator'
import { isValidate } from '../utils/mongodbValidate.js';
import { Order } from '../model/OrderModel.js'
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
    const { expiry, code, discount, isActive } = req?.body
    try {

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            {
                expiry,
                code,
                discount,
                isActive
            }, {
            new: true,
            runValidators: true
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
export const topCoupon = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    try {
        const start = startDate ? new Date(startDate) : new Date(0)
        const end = endDate ? new Date(endDate) : new Date()
        const couponResult = await Order.aggregate([
            {
                $match: {
                    couponCode: { $ne: null },
                    createdAt:{
                        $gte: start,
                        $lte: end
                    }   
                }
            },
            {
                $group: {
                    _id: '$couponCode',
                    totalOrders: {$sum:1},
                    totalDiscountGiven: { $sum: '$discountAmount' },
                    totalSalesAmount: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { totalOrders: -1 }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 0,
                    couponCode: '$_id',
                    totalOrders: 1,
                    totalDiscountGiven: 1,
                    totalSalesAmount: 1
                }
            }
        ])
        if (couponResult.length === 0) {
            return res.status(404).json(new ApiResponse([], 404, 'No coupons found'));
          }
          const response = new ApiResponse(couponResult[0], 200, 'Top Coupon Data');
          res.status(200).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
// get coupon usuage
export const getCouponUsage = asyncHandler(async (req, res, next) => {
    const { startDate, endDate, couponCode } = req.query;

    try {
        // Define match stage to filter orders by date and optionally by coupon code
        const matchStage = {
            $match: {
                ...(startDate && endDate && {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }),
                ...(couponCode && { couponCode: couponCode })
            }
        };
        console.log('Match stage:', JSON.stringify(matchStage, null, 2));

        // Aggregation pipeline to gather coupon usage statistics
        const couponUsageData = await Order.aggregate([
            matchStage,
            {
                $group: {
                    _id: '$couponCode',
                    totalOrders: { $sum: 1 },
                    totalDiscountGiven: { $sum: '$discountAmount' },
                    totalSalesAmount: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { totalOrders: -1 }
            },
            {
                $project: {
                    _id: 1,
                    code: '$_id',
                    totalOrders: 1,
                    totalDiscountGiven: 1,
                    totalSalesAmount: 1
                }
            }
        ]);
        console.log('Aggregation result:', JSON.stringify(couponUsageData, null, 2));
        const response = new ApiResponse(couponUsageData, 200, 'Get Coupon Usage Data');
        res.status(200).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, 'An Error Occurred', 501));
    }
});
