import { Visitor } from "../model/visitorsModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getVists=asyncHandler(async(req,res,next)=>{
    try {
        const totalVisits=await Visitor.countDocuments();
        res.status(201).json(new ApiResponse(totalVisits,201,"Total visits retrieved successfully"))
    } catch (error) {
        next(new ApiError([],error.stack,"An error occurred",501))
    }
})

export const getUniqueVisits = asyncHandler(async (req, res, next) => {
    try {
      const uniqueVisits = await Visitor.distinct('ipAddress').count();
      res.status(200).json(new ApiResponse({ uniqueVisits }, 200, 'Unique visits retrieved successfully'));
    } catch (error) {
      next(new ApiError([], error.stack, 'An error occurred while retrieving unique visits', 500));
    }
});

export const getPageViews = asyncHandler(async (req, res, next) => {
    try {
      const pageViews = await Visitor.aggregate([{ $group: { _id: null, totalPageViews: { $sum: '$pageViews' } } }]);
      res.status(200).json(new ApiResponse({ pageViews: pageViews[0].totalPageViews }, 200, 'Page views retrieved successfully'));
    } catch (error) {
      next(new ApiError([], error.stack, 'An error occurred while retrieving page views', 500));
    }
});

export const getNewUsers = asyncHandler(async (req, res, next) => {
    try {
      const newUsers = await Visitor.countDocuments({ isNewUser: true });
      res.status(200).json(new ApiResponse({ newUsers }, 200, 'New users retrieved successfully'));
    } catch (error) {
      next(new ApiError([], error.stack, 'An error occurred while retrieving new users', 500));
    }
});
  
export const getBounceRate = asyncHandler(async (req, res, next) => {
    try {
      // Assuming bounce rate is calculated as visits with only one page view
      const totalVisits = await Visitor.countDocuments();
      const bounces = await Visitor.countDocuments({ pageViews: 1 });
      const bounceRate = (bounces / totalVisits) * 100;
      res.status(200).json(new ApiResponse({ bounceRate }, 200, 'Bounce rate retrieved successfully'));
    } catch (error) {
      next(new ApiError([], error.stack, 'An error occurred while retrieving bounce rate', 500));
    }
});
  
export const getTraffic = asyncHandler(async (req, res, next) => {
    const { timeframe } = req.query; // 'daily', 'weekly', 'monthly', 'yearly'
    const currentTime = new Date();
    let startTime;
  
    switch (timeframe) {
      case 'daily':
        startTime = new Date(currentTime.setDate(currentTime.getDate() - 1));
        break;
      case 'weekly':
        startTime = new Date(currentTime.setDate(currentTime.getDate() - 7));
        break;
      case 'monthly':
        startTime = new Date(currentTime.setMonth(currentTime.getMonth() - 1));
        break;
      case 'yearly':
        startTime = new Date(currentTime.setFullYear(currentTime.getFullYear() - 1));
        break;
      default:
        startTime = new Date(0); // Default to all time
    }
  
    try {
      const trafficData = await Visitor.aggregate([
        { $match: { visitDate: { $gte: startTime } } },
        { $group: { _id: '$ipAddress', visits: { $sum: 1 }, isNewUser: { $max: '$isNewUser' } } },
        {
          $facet: {
            totalVisits: [{ $count: 'totalVisits' }],
            newUsers: [{ $match: { isNewUser: true } }, { $count: 'newUsers' }],
            recurringClients: [{ $match: { isNewUser: false } }, { $count: 'recurringClients' }],
          }
        }
      ]);
  
      res.status(200).json(new ApiResponse({
        totalVisits: trafficData[0].totalVisits[0]?.totalVisits || 0,
        newUsers: trafficData[0].newUsers[0]?.newUsers || 0,
        recurringClients: trafficData[0].recurringClients[0]?.recurringClients || 0,
      }, 200, 'Traffic data retrieved successfully'));
    } catch (error) {
      next(new ApiError([], error.stack, 'An error occurred while retrieving traffic data', 500));
    }
});

