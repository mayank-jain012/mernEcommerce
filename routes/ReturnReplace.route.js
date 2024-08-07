import express from 'express';
import { createReplaceRequest,handleReplaceRequest } from '../controller/ReturnReplaceController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { handleRefreshToken } from '../controller/UserController.js';
const route=express.Router()
route.post("/create",authMiddleware,createReplaceRequest)
route.put('/update/:id',handleReplaceRequest)
export default route;


