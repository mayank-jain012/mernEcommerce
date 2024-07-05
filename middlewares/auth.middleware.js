import { User } from "../model/userSchema.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.SECRET_KEY || "mnbvcxza479";
const authMiddleware =asyncHandler(async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token=req.headers.authorization.split(" ")[1];
        console.log(token)
        try{
            if(token){
                console.log("token",SECRET_KEY);
                let decoded=jwt.verify(token,SECRET_KEY)
                let user=await User.findById(decoded?.id);
                console.log("Hello world",user);
                req.user=user
                next()
            }
            
        }catch(error){
            throw new ApiError(501,"Invalid token Please Enter right token here!",error);
        }
    }else{
        throw new ApiError(501,"You are not attached any token");
    }
})

const isAdmin=asyncHandler(async(req,res,next)=>{
    const email=req.user;
    console.log(email)
    const adminUser=await User.findOne(email);
    if(adminUser.role!=="admin"){
        return next(new ApiError([],"","You are not a admin",500))
    }else{
        next();
    }
})
export {isAdmin,authMiddleware};