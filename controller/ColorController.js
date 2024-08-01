import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {validationResult} from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Color } from '../model/colorModel.js';
export const createColor=asyncHandler(async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return next(new ApiError(error.array,"","Validation error",501));
    }
    try {
      const {name}=req?.body;
      const color=await Color.findOne({name});
      if(color){
        return next(new ApiError([],"","Color already exist",402));
      }
      const data=await Color.create({
        name
      })
      await data.save();
      const response=new ApiResponse(data,201,"Color created Successfully");
      res.status(201).json(response);
    } catch (error) {
      next(new ApiError([],error.stack,"An Error Occurred",501));
    }
  })
  
  export const getAColor=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id)
    try{
      const find=await Color.findById(id);
      if(!find){
        return next(new ApiError([],"","Color not exist",402));
      }
      const response=new ApiResponse(find,201,"Color founded");
      res.status(201).json(response);
  
    }catch(error){
      next(new ApiError([],error.stack,"An error Occurred",501))
    }
  })
  
  export const getAllColor=asyncHandler(async(req,res,next)=>{
    const data=await Color.find();
    try {
      if(!data){
        return next(new ApiError([],"","No color exist",402));
      }
      const response=new ApiResponse(data,201,"Color founded");
      res.status(201).json(response);
    } catch (error) {
      next(new ApiError([],error.stack,"An error occurred",501));
    }
  })
  
  export const deleteColor=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    console.log(id);
    isValidate(id);
    try {
      const find=await Color.findByIdAndDelete(id);
      await Color.deleteOne(find);
      const response=new ApiResponse({},201,"Color deleted Successfully")
      res.status(201).json(response)
    } catch (error) {
      console.log(error);
      next(new ApiError([],error.stack,"An error occurred",501))
    }
  })
  