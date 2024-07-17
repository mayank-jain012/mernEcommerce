import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../model/cartModel.js";
import { Product } from "../model/productSchema.js";
import { Coupon } from "../model/couponModel.js";
import { Variant } from "../model/variantSchema.js";
import { validationResult } from 'express-validator'
import { User } from "../model/userSchema.js";
export const addToCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError([],error.array, "validation Error", 402))
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ApiError([], "", "Product not found", 404));
        }
        const variant = await Variant.findById(variantId);
        if (!variant) {
            return next(new ApiError([], "", "Variant not found", 404));
        }
        if (!variant || variant?.product?.toString() !== productId.toString()) {
          return next(new ApiError([], "", "Variant not found or does not belong to the specified product", 404));
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
            await User.findByIdAndUpdate(userId,{$push:{cart:cart?._id}},{new:true})
        }
        const itemIndex=cart.items.findIndex(item=> item.product.toString()===productId && item.variant.toString()===variantId);
        if(itemIndex>-1){
            if(quantity>0){
                cart.items[itemIndex].quantity+=quantity;
                console.log(`Updated quantity for existing item: ${cart.items[itemIndex].quantity}`);
            }else if(quantity<0){
                cart.items[itemIndex].quantity += quantity;
                if(cart.items[itemIndex].quantity<=0){
                    cart.items.splice(itemIndex, 1);
                }
            }
        }else if(quantity>0){
            cart.items.push({
                product:productId,
                variant:variantId,
                quantity,
                price:variant.price
            })
        }else{
            return next(new ApiError([], "", "Cannot add a negative or zero quantity for a new item", 400));
        }
       
        await cart.save();
        const response=new ApiResponse(cart, 200, "Item added to cart successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const removeCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, variantId } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError([],error.array, "validation Error", 402))
    }
    try {
        let cart = await Cart.findOne({ user: userId });
        if(cart){
            await User.findByIdAndUpdate(userId,{$pull:{cart:cart?._id}},{new:true})
        }
        if (!cart) {
            return next(new ApiError([], "", "Cart not found", 404));
        }
        const itemIndex=cart.items.findIndex(item=> item.product.toString()===productId && item.variant.toString()===variantId);
        if(itemIndex>-1){
            cart.items.splice(itemIndex, 1);
        }else{
            return next(new ApiError([], "", "Item not found in cart", 404));
        }
        if(cart.items.length===0){
            await Cart.findByIdAndDelete(cart._id);
        }
        await cart.save();
        const response=new ApiResponse(cart, 200, "Item remove from the cart successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const updateQuantity = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError([],error.array, "validation Error", 402))
    }
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return next(new ApiError([], "", "Cart not found", 404));
        }
        const itemIndex=cart.items.findIndex(item=> item.product.toString()===productId && item.variant.toString()===variantId);
        if(itemIndex>-1){
            cart.items[itemIndex].quantity+=quantity;
            console.log(`Updated quantity for existing item: ${cart.items[itemIndex].quantity}`);
        }else{
            return next(new ApiError([], "", "Item not found in cart", 404));
        }
        await cart.save();
        const response=new ApiResponse(cart, 200, "Update quantity from cart successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const getCart = asyncHandler(async (req, res, next) => {
    const userId=req.user._id;
    try {
        const cart=await Cart.findOne({user:userId}).populate({
            path:'items.product',
            populate:{
                path:'category brand'
            }
        }).populate('items.variant')
        if (!cart) {
            return next(new ApiError([], "", "Cart not found", 404));
          }
          const response = new ApiResponse(cart, 200, "Cart retrieved successfully");
          res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([],error.stack,"An Error Occurred",501))
    }
})

export const applyCoupon = asyncHandler(async (req, res, next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new ApiError([],errors.array,"Validation Error",402));
    }
    const userId=req.user._id;
    const {couponCode}=req.body;
    try {
        const coupon=await Coupon.findOne({code:couponCode})
        if(!coupon){
            return next(new ApiError([], "", "Coupon not found", 404));
        }
        if(coupon.expiry<Date.now()){
            return next(new ApiError([], "", "Coupon has expired", 400));
        }
        const cart=await Cart.findOne({user:userId});
        if(!cart){
            return next(new ApiError([], "", "Cart not found", 404));
        }
        cart.coupon=coupon._id;
        cart.discount=(cart.totalPrice*coupon.discount)/100;
        cart.finalPrice=cart.totalPrice-cart.discount;
        await cart.save();
        const response = new ApiResponse(cart, 200, "Coupon applied successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(new ApiError([], error.stack, "An error occurred", 500));
    }
})