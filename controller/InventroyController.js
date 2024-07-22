import { Inventory } from "../model/inventoryModel.js";
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidate } from "../utils/mongodbValidate.js";
import {Variant} from '../model/variantSchema.js'

//update inventroy
export const updateInventory=asyncHandler(async(req,res,next)=>{
    const {id}=req.params.id.trim();
    const {quantity,restockThreshold,warehouse}=req.body;
    isValidate(id);
    try {
        const inventory=await Inventory.findByIdAndUpdate(id,{quantity,warehouse,restockThreshold},{new:true})
        if(!inventory){
            return next(new ApiError([],"","Inventory Not Found",401))
        }
       inventory.updateStatus();
       await inventory.save();

       const response=new ApiResponse(inventory,201,"Inventory Update Successfully");
       res.status(201).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501));
    }
})
// get inventory
export const getInventoryByProductId=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    isValidate(id);
    try {
        const variant=await Variant.find({product:id}).populate('size color')
        if(!variant || variant.length===0){
            return next(new ApiError([],"","No Variant Exist",501));
        }
        const inventoryDetails=await Promise.all(variant.map(async(variants)=>{
            const inventory=await Inventory.findOne({variant:variant._id})
            return{
                variants,
                inventory
            }
        }))
        const response=new ApiResponse(inventoryDetails,201,"Fetched Inventory Details Successfully")
        res.status(201).json(response);
    } catch (error) {
        
    }
})
// get all inventory
export const getAllInventory=asyncHandler(async(req,res,next)=>{
    const inventroy=await Inventory.find().populate('product,variant');
    if(!inventroy){
        return next(new ApiError([],"","Inventory Does Not Exist",402))
    }
    const response=new ApiResponse(inventroy,201,"Get Inventory For all products");
    res.status(response.statusCode).json(response);
})
// delete inventory
export const deleteInventory=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    isValidate(id);
    try {
        const inventory=await Inventory.findByIdAndDelete(id);
        if(!inventory){
            return next(new ApiError([],"","Inventory Does Not Exist",402))
        }
        const response=new ApiResponse({},201,"Delete Inventory Successfully")
        res.status(201).res.json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})
// get low stock items
export const getLowStockItems=asyncHandler(async(req,res,next)=>{
    const thresholdItem=await Inventory.find({quantity:{$lt:restockThreshold}}).populate('product variant');
    if(!thresholdItem){
        return next(new ApiResponse({},201,"No ThresHold Item"));
    }
    const response=new ApiResponse(thresholdItem,201,"Low Stock Item Successfully");
    res.status(201).res.json(response);
})
// get inventory status item
export const getInventoryStatus=asyncHandler(async(req,res,next)=>{
    const totalItem=Inventory.countDocuments();
    const inStockItem=Inventory.countDocuments({status:'in-stock'});
    const outStockItem=Inventory.countDocuments({status:'out-of-stock'});
    const data={
        totalItem,inStockItem,outStockItem
    }
    const response=new ApiResponse(data,201,"Inventory Status fetched Successfully");
    res.status(201).json(response);
})
