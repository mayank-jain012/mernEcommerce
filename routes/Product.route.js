import express from 'express';

import { createProduct, deleteProduct, getAProduct, getProduct, updateProduct } from '../controller/ProductController.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validateProduct } from '../middlewares/validator.middleware.js';
const productRoute = express.Router();
productRoute.post("/create", upload.array('images',4),validateProduct,createProduct);
productRoute.get('/get',getProduct);
productRoute.get('/get/:id',getAProduct);
productRoute.put('/update/:id',upload.array('images',4),validateProduct,updateProduct);
productRoute.delete('/delete/:id',deleteProduct);
export default productRoute;