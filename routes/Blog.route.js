import express from "express";
import { createBlog, deleteBlog, disLikeBlog, getABlog, getAllBlogsLikesDislikes, getBlog, getBlogPerformance, getBlogsdisLikes, getBlogsLikes, getMostViewBlog, likeBlog, updateABlog } from "../controller/BlogController.js";
import { validateBlog } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post('/create', upload.array('images', 1), validateBlog, createBlog);
router.get('/get', getBlog);
router.get('/get/:id', getABlog);
router.put('/update/:id',upload.array('images',1),validateBlog,updateABlog);
router.delete('/delete', deleteBlog);
router.post('/like/:id',authMiddleware,likeBlog);
router.post('/dislike/:id',authMiddleware,disLikeBlog);
router.get('/likesBlog/:id',getBlogsLikes);
router.get('/dislikesBlog/:id',getBlogsdisLikes);
router.get('/getBlogLikesDislikes',getAllBlogsLikesDislikes);
router.get('/getMostViewBlog',getMostViewBlog);
router.get('/getBlogPerformance',getBlogPerformance);
export default router;