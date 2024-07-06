import express from "express";
import { createBlog, getBlog } from "../controller/BlogController.js";
import { validateBlog } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=express.Router();
router.post('/create',upload.array('images',1),validateBlog,createBlog);
router.get('/get',getBlog);
export default router;