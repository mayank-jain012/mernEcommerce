import { Size } from "../model/sizeSchema.js";
import {ApiResponse} from '../utils/apiResponse.js'
import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {validationResult} from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
export const createSize=asyncHandler(async(req,res,next)=>{
  const error=validationResult(req);
  if(!error.isEmpty()){
      return next(new ApiError(error.array,"","Validation error",501));
  }
  try {
    const {name}=req?.body;
    const size=await Size.findOne({name});
    if(size){
      return next(new ApiError([],"","Size already exist",402));
    }
    const data=await Size.create({
      name
    })
    await data.save();
    const response=new ApiResponse(data,201,"Size created Successfully");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([],error.stack,"An Error Occurred",501));
  }
})

export const getASize=asyncHandler(async(req,res,next)=>{
  const id=req.params.id.trim();
  isValidate(id)
  try{
    const find=await Size.findById(id);
    if(!find){
      return next(new ApiError([],"","Size not exist",402));
    }
    const response=new ApiResponse(find,201,"Size founded");
    res.status(201).json(response);

  }catch(error){
    next(new ApiError([],error.stack,"An error Occurred",501))
  }
})

export const getAllSize=asyncHandler(async(req,res,next)=>{
  const data=await Size.find();
  try {
    if(!data){
      return next(new ApiError([],"","No size exist",402));
    }
    const response=new ApiResponse(data,201,"Size founded");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([],error.stack,"An error occurred",501));
  }
})

export const deleteSize=asyncHandler(async(req,res,next)=>{
  const id=req.params.id.trim();
  console.log(id);
  isValidate(id);
  try {
    const find=await Size.findByIdAndDelete(id);
    await Size.deleteOne(find);
    const response=new ApiResponse({},201,"Size deleted Successfully")
    res.status(201).json(response)
  } catch (error) {
    console.log(error);
    next(new ApiError([],error.stack,"An error occurred",501))
  }
})