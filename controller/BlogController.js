import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validationResult } from 'express-validator'
import { isValidate } from "../utils/mongodbValidate.js";
import { Blog } from '../model/blogModel.js';
import slugify from 'slugify';
import { response } from 'express';

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
    const { category, sort, limit, page, tag, author } = req.query;
    let query = {}
    if (category) {
        query.category = category;
    }
    if (author) {
        query.author = author;
    }
    if (tag) {
        query.tag = { $in: tag.split(',') }
    }
    const options = {
        paginate: parseInt(page, 10) || 10,
        sort: { createdAt: -1 },
        limit: parseInt(limit, 10) || 10
    }
    if (sort) {
        options.sort = { [sort]: 1 };
    }
    try {
        const result = await Blog.paginate(query, options);

        const response = new ApiResponse({
            blogs: result.docs,
            total: result.totalDocs,
            totalPages: result.totalPages,
            currentPage: result.page,
        }, 200, "Blogs fetched successfully");
        res.status(response.statusCode).json(response)
    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
export const getABlog = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    try {
        const find = await Blog.findById(id);
        if (!find) {
            return next(new ApiError([], "", "Blog not found", 402))
        }
        find.views += 1;
        find.likesCount=find.likes.length;
        find.disLikesCount=find.dislikes.length;
        await find.save();
        const response = new ApiResponse(find, 201, "Blog founded");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An error Occurred", 501))
    }
})
export const updateABlog = asyncHandler(async (req, res, next) => {
    const blogId=req.params.id.trim();
    isValidate(blogId);
    try {
        const {title,content,tags}=req.body;
        const data=await Blog.findByIdAndUpdate(blogId,{
            title,
            content,
            tags,
            images:req.files.map(file=>file.path)
        },{new:true})
        if(!data){
            return next(new ApiError([],"","Blog was not found",401))
        }
        const response=new ApiResponse(data,201,"Update Blog Successfully")
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})
export const deleteBlog =asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    try {
        const blog=await Blog.findByIdAndDelete(id);
        if(!blog){
            return next(new ApiError([],error,stack,"An Error Occurred",402))
        }
        const response=new ApiResponse({},201,"Blog Deleted Successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})
export const likeBlog=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    const userId=req.user._id;
    try {
        const blog=await Blog.findById(id);
        if(!blog){
            return next(new ApiError([],"","Blog Not Found",401));
        }
        if(blog.likes.includes(userId)){
            return next(new ApiError([],"","You Already Like The Blog",401));
        }
        blog.likes.push(userId);
        blog.dislikes.pull(userId);
        await blog.save();
        const response =new ApiResponse(blog,201,"Like the blog successfully");
        res.status(201).json(response);
    } catch (error) {
        new ApiError([],error.stack,"An Error occurred",501)
    }
})
export const disLikeBlog=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    const userId=req.user._id;
    try {
        const blog=await Blog.findById(id);
        if(!blog){
            return next(new ApiError([],"","Blog Not Found",401));
        }
        if(blog.dislikes.includes(userId)){
            return next(new ApiError([],"","You Already Like The Blog",401));
        }
        blog.dislikes.push(userId);
        blog.likes.pull(userId);
        await blog.save();
        const response =new ApiResponse(blog,201,"Dislike the blog successfully");
        res.status(201).json(response);
    } catch (error) {
        new ApiError([],error.stack,"An Error occurred",501)
    }
})
export const getBlogsLikes=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    try {
        const blog=await Blog.findById(id).populate('likes','name')
        if(!blog){
            return next(new ApiError([],"","Blog Not Found",401));
        }
        const response =new ApiResponse(blog.likes,201,"Like the blog successfully");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})
export const getBlogsdisLikes=asyncHandler(async(req,res,next)=>{
    const id=req.params.id.trim();
    isValidate(id);
    try {
        const blog=await Blog.findById(id).populate('dislikes','name')
        if(!blog){
            return next(new ApiError([],"","Blog Not Found",401));
        }
        const response =new ApiResponse(blog.dislikes,201,"Like the blog successfully");
        res.status(201).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})
export const getAllBlogsLikesDislikes = asyncHandler(async (req, res, next) => {
    try {
      const blogs = await Blog.find({}).populate('likes dislikes', 'name');
  
      const result = blogs.map(blog => ({
        _id: blog._id,
        title: blog.title,
        likesCount: blog.likes.length,
        dislikesCount: blog.dislikes.length
      }));
  
      const response = new ApiResponse(result, 200, "Blogs' likes and dislikes fetched successfully");
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(new ApiError([], error.stack, "An error occurred while fetching blogs' likes and dislikes", 500));
    }
 });
 // get blog performance
 export const getBlogPerformance=asyncHandler(async(req,res,next)=>{
 })
// get most viewed blog
export const getMostViewBlog=asyncHandler(async(req,res,next)=>{
})