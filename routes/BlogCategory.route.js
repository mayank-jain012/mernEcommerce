import { createBlogCategory, 
    deleteBlogCategory, 
    getAllBlogCategory, 
    getABlogCategory
} from "../controller/BlogCategoryController.js";
import { size } from "../middlewares/validator.middleware.js";
import express from "express";
const route=express.Router();
route.post('/create',size,createBlogCategory);
route.get('/get/:id',getABlogCategory);
route.get('/get',getAllBlogCategory);
route.delete('/delete/:id',deleteBlogCategory);
export default route