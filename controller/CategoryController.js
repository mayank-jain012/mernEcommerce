import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Category } from '../model/categoryModel.js';
import slugify from 'slugify';
export const createCategory = asyncHandler(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new ApiError(error.array, "", "Validation error", 501));
  }
  try {
    const { name } = req?.body;
    const slug = slugify(name, { lower: true })
    const category = await Category.findOne({ name });
    if (category) {
      return next(new ApiError([], "", "Category already exist", 402));
    }
    //   const images = req.files.map(file => ({ data: file.buffer, contentType: file.mimetype }));
    const data = await Category.create({
      name,
      slug,
      images: req.files.map(file => file.path)
    })
    await data.save();
    const response = new ApiResponse(data, 201, "Category created Successfully");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, "An Error Occurred", 501));
  }
})

export const getACategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  isValidate(id)
  try {
    const find = await Category.findById(id);
    if (!find) {
      return next(new ApiError([], "", "Category not exist", 402));
    }
    const response = new ApiResponse(find, 201, "Category founded");
    res.status(201).json(response);

  } catch (error) {
    next(new ApiError([], error.stack, "An error Occurred", 501))
  }
})

export const getAllCategory = asyncHandler(async (req, res, next) => {
  const data = await Category.find();
  try {
    if (!data) {
      return next(new ApiError([], "", "No category exist", 402));
    }
    const response = new ApiResponse(data, 201, "Category founded");
    res.status(201).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, "An error occurred", 501));
  }
})

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id.trim();
  console.log(id);
  isValidate(id);
  try {
    const find = await Category.findByIdAndDelete(id);
    await Category.deleteOne(find);
    const response = new ApiResponse({}, 201, "Category deleted Successfully")
    res.status(201).json(response)
  } catch (error) {
    console.log(error);
    next(new ApiError([], error.stack, "An error occurred", 501))
  }
})

export const updateCategory = asyncHandler(async (req, res, next) => {
  const error=validationResult(req);
  if(!error.isEmpty()){
    return next(new ApiError())
  }
  const id = req.params.id.trims();
  const { name } = req.body;
  isValidate(id);
  try {
    const data = await Category.findByIdAndUpdate(
      id,
      { name, images: req.files.map(file => file.path) },
      { new: true }
    );
    if (!data) {
      return next(new ApiError([], "", "Category Not Exist", 402));
    }
    await data.save();
    const response = new ApiResponse(data, 201, "Category Updated Successfully")
  } catch (error) {
    next(new ApiError())
  }
})