import {Visitor} from '../model/visitorsModel.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const trackVisit=asyncHandler(async(req,res,next)=>{
    try {
        const ipAddress=req.ip || req.connection.remoteAddress;
        const userAgent=req.headers['user-agent'];
        const pageVisited=req.orignalUrl;
        let visitor=await Visitor.findOne({ipAddress});
        if(visitor){
            visitor.isNewUser=false;
            visitor.pageViews+=1;
            visitor.pagesVisited.push(pageVisited)
            visitor.sessionDuration+=30
        }else{
            visitor=new Visitor({
                ipAddress,
                userAgent,
                pagesVisited:[pageVisited]
            })
        }
        await visitor.save();
        next();
    } catch (error) {
        next(new ApiError([],error.stack,"An error Occurred",501))
    }
})