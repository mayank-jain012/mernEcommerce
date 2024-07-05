import { createBrand, 
    deleteBrand, 
    getAllBrand, 
    getABrand
} from "../controller/BrandController.js";
import { size } from "../middlewares/validator.middleware.js";
import express from "express";
const route=express.Router();
route.post('/create',size,createBrand);
route.get('/get/:id',getABrand);
route.get('/get',getAllBrand);
route.delete('/delete/:id',deleteBrand);
export default route