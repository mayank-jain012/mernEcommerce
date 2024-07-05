import { createColor, 
    deleteColor, 
    getAllColor, 
    getAColor 
} from "../controller/ColorController.js";
import { size } from "../middlewares/validator.middleware.js";
import express from "express";
const route=express.Router();
route.post('/create',size,createColor);
route.get('/get/:id',getAColor);
route.get('/get',getAllColor);
route.delete('/delete/:id',deleteColor);
export default route