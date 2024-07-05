import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {validationResult} from 'express-validator'
import {isValidate} from "../utils/mongodbValidate.js";
import {BlogCategory} from '../model/blogCategoryModel.js';
import slugify from 'slugify';
export const createBlogCategory=asyncHandler(async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return next(new ApiError(error.array,"","Validation error",501));
    }
    try {
      const {name}=req?.body;
      const slug=slugify(name,{lower:true})
      const blogcategory=await BlogCategory.findOne({name});
      if(blogcategory){
        return next(new ApiError([],"","BlogCategory already exist",402));
      }
      const data=await BlogCategory.create({
        name,
        slug
      })
      await data.save();
      const response=new ApiResponse(data,201,"BlogCategory created Successfully");
      res.status(201).json(response);
    } catch (error) {
      next(new ApiError([],error.stack,"An Error Occurred",501));
    }
  })
  
  export const getABlogCategory=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id)
    try{
      const find=await BlogCategory.findById(id);
      if(!find){
        return next(new ApiError([],"","BlogCategory not exist",402));
      }
      const response=new ApiResponse(find,201,"BlogCategory founded");
      res.status(201).json(response);
  
    }catch(error){
      next(new ApiError([],error.stack,"An error Occurred",501))
    }
  })
  
  export const getAllBlogCategory=asyncHandler(async(req,res,next)=>{
    const data=await BlogCategory.find();
    try {
      if(!data){
        return next(new ApiError([],"","No blogcategory exist",402));
      }
      const response=new ApiResponse(data,201,"BlogCategory founded");
      res.status(201).json(response);
    } catch (error) {
      next(new ApiError([],error.stack,"An error occurred",501));
    }
  })
  
  export const deleteBlogCategory=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    console.log(id);
    isValidate(id);
    try {
      const find=await BlogCategory.findByIdAndDelete(id);
      await BlogCategory.deleteOne(find);
      const response=new ApiResponse({},201,"BlogCategory deleted Successfully")
      res.status(201).json(response)
    } catch (error) {
      console.log(error);
      next(new ApiError([],error.stack,"An error occurred",501))
    }
  })