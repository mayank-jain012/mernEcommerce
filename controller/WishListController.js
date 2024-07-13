import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { Variant } from '../model/variantSchema.js'
import { Product } from '../model/productSchema.js'
import { validationResult } from 'express-validator'
import { Wishlist } from '../model/wishlistModel.js'
import { User } from '../model/userSchema.js'

export const addWishlist = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const { items } = req?.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation Error", 401));
    }
    try {
        let wishlist = await Wishlist.findOne({ user: userId })
        console.log(wishlist);

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [] })
            await User.findByIdAndUpdate(userId, { $push: { wishlist: wishlist?._id } }, { new: true });

        }
        for (const item of items) {
            const { productId, variantId } = item;
            if (!productId) {
                return next(new ApiError([], "", "Product Id is required", 402));
            }
            const product = await Product.findById(productId);
            if (!product) {
                return next(new ApiError([], "", "Product Not Found", 402));
            }
            if (variantId) {
                const variant = await Variant.findById(variantId);
                console.log(variant);
                if (!variant || variant.product.toString() !== productId) {
                    return next(new ApiError([], "", "Invalid Variant Id for Product", 402))
                }
            }
            const itemExist = wishlist.items.some(
                (existingItem) =>
                    existingItem.product.toString() === productId &&
                    (!variantId || (existingItem.variant && existingItem.variant.toString() === variantId)))
            if (!itemExist) {
                wishlist.items.push({ product: productId, variant: variantId })
            }
        }

        await wishlist.save();

        const response = new ApiResponse(wishlist, 201, "Add Product in Wishlist");
        res.status(response.statusCode).json(response);

    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
export const getWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation Error", 401));
    }
    try {
        const wishlist = await Wishlist.findOne({ user:userId }).populate({
            path:"items.product",
            populate:{
                path:"brand category"
            }
        }).populate({
            path:"items.variant"
        })
        if (!wishlist) {
            return next(new ApiError([], "", "Wishlist not found", 401));
        }
        const response = new ApiResponse(wishlist, 200, "Wishlist retrieved successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.log(error);
        next(new ApiError([], error.stack, "An error occurred", 500));
    }
})
export const removeWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, variantId } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array, "", "Validation Error", 401));
    }
    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return next(new ApiError([], "", "Wishlist not found", 401));
        }
        const itemIndex = wishlist.items.findIndex((item) => item.product.toString() === productId && (!variantId || item.variant.toString() == variantId))
        if (itemIndex === -1) {
            return next(new ApiError([], "", "Product and variant not found in wishlist", 401))
        }
        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();
        const response = new ApiResponse(wishlist, 200, "Product removed from wishlist successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.log(error);
        next(new ApiError([], error.stack, "An error occurred", 500));
    }
})
