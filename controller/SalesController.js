import { Sales } from "../model/salesSchema.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
//get all sales
export const getAllSales = asyncHandler(async (req, res) => {
    try {
        const salesData = await Sales.aggregate([
            {
                $group: {
                    _id:'$product',
                    totalQuantitySold:{$sum:'$quantity'},
                    SalesAmount:{$sum:{$multiply:['$quantity','$price']}},
                    discountedPrice:{$sum:'$discountedPrice'},
                    finalPrice:{$sum:'$finalPrice'}
                }
            }, 
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'productDetails'
                }
            }, 
            {
                $unwind: '$productDetails'
            }, 
            {
                $project: {
                    _id:0,
                    productId:"$_id",
                    productName:'$productDetails.name',
                    totalQuantitySold:1,
                    SalesAmount:1,
                    finalPrice:1,
                    discountedPrice:1
                }
            }
        ])
        const response=new ApiResponse(salesData,201,"Get All product Sale")
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], {}, "An Error Occurred", 501))
    }
})
//get Sales by date range
// get total sales
// get sales by productid
// get sales overview
// get sales for product
// get sales for trends
// get top selling product
// get top selling category
// get sales by category
// get sales by brand

// get sales by color

// get sales by region

// get sales by forecast
// get popular variant






