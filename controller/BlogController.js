import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Blog } from '../model/blogModel.js';
import slugify from 'slugify';


export const createBlog = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError([], error.array, "Validation Error", 402))
    }

    try {
        const { title, category, content, author, tags } = req.body;
        const slug = slugify(title, { lower: true })
        const find = await Blog.findOne({ slug });
        if (find) {
            return next(new ApiError([], "", "Blog already Exist", 402))
        }
        const data = await Blog.create({
            title,
            slug,
            category,
            content,
            author,
            tags,
            images: req.files.map(file => file.path)
        })
        await data.save();
        console.log(data)
        const reponse = new ApiResponse(data, 201, "Blog created succesfully");
        res.status(201).json(reponse);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})

export const getBlog = asyncHandler(async (req, res, next) => {
    try {
        const data=await Blog.find();
        if(!data){
            return next(new ApiError([],"","No Blog exist in database",402));
        }
        await data.save();
        const response=new ApiResponse(data,201,"Blog Found");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An error Occurred",501));
    }


})

export const getABlog=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    try {
        const find=await Blog.findById(id);
        if(!find){
            return next(new ApiError([],"","Blog not found",402))
        }
        find.views+=1;
        await find.save();
        const response=new ApiResponse(find,201,"Blog founded");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An error Occurred",501))
    }
})

export const updateABlog=asyncHandler(async(req,res,next)=>{

})
