import { ApiError } from "../utils/apiError.js";
export const errorHandler=(err,req,res,next)=>{
    let apierror=err;
    if(!(err instanceof ApiError)){
        const statusCode=err.statusCode||500
        const message=err.message
      
        apierror=new ApiError([],err.stack,message,statusCode)
    }
    res.status(apierror.statusCode).json({
        success:apierror.success || false,
        message:apierror.message,
        errors:apierror.errors || [],
        stack:process.env.NODE_ENV==="production"?apierror.stack:null
    });
};