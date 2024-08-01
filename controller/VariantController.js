import { Variant } from "../model/variantSchema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { isValidate } from "../utils/mongodbValidate.js";
import { Product } from "../model/productSchema.js";

export const createVariant=asyncHandler(async(req,res,next)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return next(new ApiError(errors.array(), "", "Validation Error", 400));
      }
      try {
        const { productId, size, color, price, stock } = req.body;
        const images = req.files.map(file => file.path);
    
        let newVariant = await Variant.create({
          product:productId,
          size,
          color,
          price,
          stock,
          images,
        });
    
        newVariant = await newVariant.save();
        
        const product = await Product.findById(productId);
        if (!product) {
          return next(new ApiError([], "Product not found", "Not Found", 404));
        }
    
        product.variants.push(newVariant._id);
        await product.save();
        await newVariant.save();
        const response = new ApiResponse(newVariant, 201, "Variant added successfully");
        res.status(response.statusCode).json(response);
      } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An error occurred", 500));
      }
})

export const updateVariant=asyncHandler(async(req,res,next)=>{
  const productId=req.params.id.trim();
  const errors=validationResult(req)
  if (!errors.isEmpty()) {
      return next(new ApiError(errors.array(), "", "Validation Error", 400));
    }
    try {
      const {size, color, price, stock } = req.body;
      const update={size,color,price,stock}
      if(req.files){
        const imagesUrl = req.files.map(file => file.path);
        update.images=imagesUrl
      }
      
      let newVariant=await Variant.findByIdAndUpdate(productId,update,
       {new:true});
  
      newVariant = await newVariant.save();
      if (!newVariant) {
        return next(new ApiError([], "Product not found", "Not Found", 404));
      }
      await newVariant.save();
      const response = new ApiResponse(newVariant, 201, "Variant updated successfully");
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.log(error)
      next(new ApiError([], error.stack, "An error occurred", 500));
    }
})

export const getVariant=asyncHandler(async(req,res,next)=>{
    try {
        const products = await Variant.find()
          .populate('size')
          .populate('color')
        const response = new ApiResponse(products, 200, "Variants fetched successfully");
        res.status(response.statusCode).json(response);
      } catch (error) {
        next(new ApiError([], error.stack, "An error occurred", 500));
      }
})

export const deleteVariant=asyncHandler(async(req,res,next)=>{
    const id = req.params.id.trim();
  isValidate(id);
  try {
    const product = await Variant.findByIdAndDelete(id);
    if (!product) {
      return next(new ApiError([], "", "Variant not exist", 402))
    }
    const response = new ApiResponse(product, 201, "Variant Deleted");
    res.status(201).json(response)
  } catch (error) {
    next(new ApiError([], error.stack, "An error Occurred", 501))
  }
})