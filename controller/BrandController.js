import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Brand } from '../model/brandModel.js';
import slugify from 'slugify';
export const createBrand = asyncHandler(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new ApiError(error.array, "", "Validation error", 501));
  }
  try {
    const { name } = req?.body;
    const slug = slugify(name, { lower: true })
    const brand = await Brand.findOne({ name });
    if (brand) {
      return next(new ApiError([], "", "Brand already exist", 402));
    }
    const data = await Brand.create({
      name,
      slug
    })
    await data.save();
    const response = new ApiResponse(data, 201, "Brand created Successfully");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, "An Error Occurred", 501));
  }
})
export const getABrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  isValidate(id)
  try {
    const find = await Brand.findById(id);
    if (!find) {
      return next(new ApiError([], "", "Brand not exist", 402));
    }
    const response = new ApiResponse(find, 201, "Brand founded");
    res.status(201).json(response);

  } catch (error) {
    next(new ApiError([], error.stack, "An error Occurred", 501))
  }
})
export const getAllBrand = asyncHandler(async (req, res, next) => {
  const data = await Brand.find();
  try {
    if (!data) {
      return next(new ApiError([], "", "No brand exist", 402));
    }
    const response = new ApiResponse(data, 201, "Brand founded");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, "An error occurred", 501));
  }
})
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  console.log(id);
  isValidate(id);
  try {
    const find = await Brand.findByIdAndDelete(id);
    await Brand.deleteOne(find);
    const response = new ApiResponse({}, 201, "Brand deleted Successfully")
    res.status(201).json(response)
  } catch (error) {
    console.log(error);
    next(new ApiError([], error.stack, "An error occurred", 501))
  }
})

// get brand performance
export const getBrandPerformance= asyncHandler(async (req, res, next) => {

})
// get brand sales trends
export const brandSalesTrends=asyncHandler(async(req,res,next)=>{

})