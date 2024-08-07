import { Product } from "../model/productSchema.js";
import { Variant } from "../model/variantSchema.js";
import slugify from 'slugify'
import { validationResult, body } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidate } from "../utils/mongodbValidate.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array(), "", "Validation Error", 400));
  }
  try {
    const { name, category, brand, description,section,age } = req.body;
    console.log(name);
    const slug = slugify(name, { lower: true });
    // Creating product
    let product = new Product({
      name,
      slug,
      category,
      brand,
      description,
      images: req.files.map(file => file.path),
      section,
      age
    });
    // Saving product
    product = await product.save();
    const response = new ApiResponse(product, 201, "Product added successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.log(error);
    next(new ApiError([], error.stack, "An error occurred", 500));
  }
})
export const getProduct = asyncHandler(async (req, res, next) => {
  try {
    const {brand,size,color,category,limit=10,page=1,sort="createdAt",section,age}=req.query;
    let filter={};
    if(brand){
      filter.brand=brand;
    }
    if(category){
      filter.category=category
    }
    if(section){
      filter.section=section
    }
    if(age){
      filter.age=age
    }
    if(color|| size){
      let variantFilter={}
      if(color){
        variantFilter.color=color
      }
      if(size){
        variantFilter.size=size
      }
      const variants=await Variant.find(variantFilter).select("_id");
      const variantId=variants.map(varaint=>varaint?._id);
      filter.variants={$in:variantId}
    }
    const option={
      page:parseInt(page,10),
      limit:parseInt(limit,10),
      sort:{[sort]:1}
    }
    const products = await Product.paginate(filter,option)
    const response = new ApiResponse(products, 200, "Products fetched successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, "An error occurred", 500));
  }
})
export const getAProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  isValidate(id);
  try {
    const product = await Product.findById(id)
    if (!product) {
      return next(new ApiError([], "", "Product not exist", 402))
    }
    const response = new ApiResponse(product, 201, "Product found")
    res.status(201).json(response)
  } catch (error) {
    next(new ApiError([], error.stack, "An error Occurred", 501))
  }
})
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  isValidate(id);
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(new ApiError([], "", "Product not exist", 402))
    }
    const response = new ApiResponse(product, 201, "Product Deleted");
    res.status(201).json(response)
  } catch (error) {
    next(new ApiError([], error.stack, "An error Occurred", 501))
  }
})
export const updateProduct = asyncHandler(async (req, res, next) => {
  const id=req.params.id.trim();
  isValidate(id);
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(new ApiError(errors.array(), "", "Validation Error", 400));
  // }
  try {
    const { category, brand, description,section,age } = req.body;
    const product=await Product.findByIdAndUpdate(id,{
      category,
      brand,
      description,
      section,
      age
    },{new:true});
    if(!product){
      return next(new ApiError([], "", "Product not exist", 402))
    }
    await product.save();
    const response = new ApiResponse(product, 201, "Product updated successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.log(error);
    next(new ApiError([], error.stack, "An error occurred", 500));
  }
})
