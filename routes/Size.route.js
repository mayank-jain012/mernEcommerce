import { createSize, deleteSize, getAllSize, getASize } from "../controller/SizeController.js";
import { size } from "../middlewares/validator.middleware.js";
import express from "express";
const route=express.Router();
route.post('/create',size,createSize);
route.get('/get/:id',getASize);
route.get('/get',getAllSize);
route.delete('/delete/:id',deleteSize);
export default route