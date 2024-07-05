import express from 'express';

import { createProduct } from '../controller/ProductController.js';
// import { addProduct } from '../middlewares/validator.middleware.js';
const productRoute = express.Router();
productRoute.post("/create", createProduct);
export default productRoute;