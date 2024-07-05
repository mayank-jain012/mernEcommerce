import { createCategory, 
    deleteCategory, 
    getAllCategory, 
    getACategory,
    updateCategory
} from "../controller/CategoryController.js";
import { size } from "../middlewares/validator.middleware.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
const route=express.Router();
route.post('/create',upload.array('image',1),size,createCategory);
route.get('/get/:id',getACategory);
route.get('/get',getAllCategory);
route.delete('/delete/:id',deleteCategory);
route.put('/put/:id',upload.array('image',1),size,updateCategory);
export default route