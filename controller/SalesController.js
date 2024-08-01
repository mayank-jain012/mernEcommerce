import { Sales } from "../model/salesSchema.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isValidate } from '../utils/mongodbValidate.js';
//get Sales by date range
export const getSalesByDate = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query
    try {
        const salesData = await Sales.aggregate([
            {
                $match: {
                    salesDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: '$product',
                    totalQuantitySold: { $sum: '$quantity' },
                    SalesAmount: { $sum: { $multiply: ['$quantity', '$price'] } },
                    discountedPrice: { $sum: '$discountedPrice' },
                    finalPrice: { $sum: '$finalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: '$productDetails.name',
                    totalQuantitySold: 1,
                    SalesAmount: 1,
                    finalPrice: 1,
                    discountedPrice: 1
                }
            }
        ])
        console.log(salesData)
        const response = new ApiResponse(salesData, 201, "Get All product Sale")
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
// get sales by productid
export const getSaleByProductId = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    try {
        const saleData = await Sales.findOne({ product: id }).populate('product', 'brand category ')
        if (saleData.length === 0) {
            return next(new ApiError([], {}, "This product has no sale", 501));
        }
        const response = new ApiResponse(saleData, 201, "Get All product Sale")
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
// get sales overview
export const overView = asyncHandler(async (req, res, next) => {
   try {
    const overview = await Sales.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: { $multiply: ['$quantity', '$price'] } },
                totalQuantitySold: { $sum: '$quantity' },
                averageSaleValue: { $avg: { $multiply: ['$quantity', '$price'] } },
                salesByCategory: { $push: { category: '$category', amount: { $multiply: ['$quantity', '$price'] } } },
                salesByBrand: { $push: { brand: '$brand', amount: { $multiply: ['$quantity', '$price'] } } },
                salesByColor: { $push: { color: '$variant.color', amount: { $multiply: ['$quantity', '$price'] } } },
                salesBySize: { $push: { size: '$variant.size', amount: { $multiply: ['$quantity', '$price'] } } },
            }

        },
        {
            $project: {
                _id: 0,
                totalSales: 1,
                totalQuantitySold: 1,
                averageSaleValue: 1,
                salesByCategory: {
                    $arrayToObject: {
                        $map: {
                            input: '$salesByCategory',
                            as: 'categorySales',
                            in: {
                                k: '$$categorySales.category',
                                v: { $sum: '$$categorySales.amount' }
                            }
                        }
                    }
                },
                salesByBrand: {
                    $arrayToObject: {
                        $map: {
                            input: '$salesByBrand',
                            as: 'brandSales',
                            in: {
                                k: '$$brandSales.brand',
                                v: { $sum: '$$brandSales.amount' }
                            }
                        }

                    }
                },
                salesByColor: {
                    $arrayToObject: {
                        $map: {
                            input: '$salesByColor',
                            as: 'colorSales',
                            in: {
                                k: '$$colorSales.color',
                                v: { $sum: '$$colorSales.amount' }
                            }
                        }

                    }
                },
                salesBySize: {
                    $arrayToObject: {
                        $map: {
                            input: '$salesBySize',
                            as: 'sizeSales',
                            in: {
                                k: '$$sizeSales.size',
                                v: { $sum: '$$sizeSales.amount' }
                            }
                        }
                    }
                }
            }
        }
    ])
    const response=new ApiResponse(overview,201,"OverView for the product");
    res.status(201).json(response);
   } catch (error) {
    next(new ApiError([],error.stack,"An Error Occurred",402))
   }
})
// get sales by category
export const getSalesByCategory = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query
    try {
      const salesData = await Sales.aggregate([
        {
            $match: {
                salesDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
          $group: {
            _id: "$category",
            totalQuantitySold: { $sum: "$quantity" },
            totalSalesAmount: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
        {
          $project: {
            _id: 0,
            color: "$_id",
            totalQuantitySold: 1,
            totalSalesAmount: 1,
          },
        },
        {
            $sort: { totalQuantitySold: -1 }
          },
          {
            $limit: 10 // Adjust the limit as needed
          }
      ]);
  
      const response=new ApiResponse(salesData,201,"Get Sale By Category");
      res.status(201).json(response)
    } catch (error) {
        next(new ApiError([],error.stack,"An error occurred while fetching sales data by brand",501));
    }
  });
// get sales by brand
export const getSalesByBrand = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query
    try {
      const salesData = await Sales.aggregate([
        {
            $match: {
                salesDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
          $group: {
            _id: "$brand",
            totalQuantitySold: { $sum: "$quantity" },
            totalSalesAmount: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
        {
          $project: {
            _id: 0,
            color: "$_id",
            totalQuantitySold: 1,
            totalSalesAmount: 1,
          },
        },
        {
            $sort: { totalQuantitySold: -1 }
          },
          {
            $limit: 10 // Adjust the limit as needed
          }
      ]);
  
      const response=new ApiResponse(salesData,201,"Get Sale By Brand");
      res.status(201).json(response)
    } catch (error) {
      next(new ApiError([],error.stack,"An error occurred while fetching sales data by brand",501));
    }
  });
// get sales by color
export const getSalesByColor = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query
    try {
      const salesData = await Sales.aggregate([
        {
            $match: {
                salesDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
          $group: {
            _id: "$variant.color",
            totalQuantitySold: { $sum: "$quantity" },
            totalSalesAmount: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
        {
          $project: {
            _id: 0,
            color: "$_id",
            totalQuantitySold: 1,
            totalSalesAmount: 1,
          },
        },
        {
            $sort: { totalQuantitySold: -1 }
          },
          {
            $limit: 10 // Adjust the limit as needed
          }
      ]);
  
      const response=new ApiResponse(salesData,201,"Get Sale By Color");
      res.status(201).json(response)
    } catch (error) {
        next(new ApiError([],error.stack,"An error occurred while fetching sales data by color",501));
    }
});










