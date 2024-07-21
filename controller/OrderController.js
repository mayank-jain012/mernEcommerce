import { Order } from "../model/OrderModel.js";
import { Cart } from '../model/cartModel.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { calculateShipping } from "../utils/shipRocket.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendEmail } from "../utils/sendEmail.js";
export const createOrder = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const {  paymentMethod,shippingAddress } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId }).populate("items.product items.variant")
        if (!cart || cart.items.length === 0) {
            return next(new ApiError([], "", "No items in cart", 400));
        }
        const deliveryCharges = await calculateShipping('4',shippingAddress.postalCode);
        const itemPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxPrice = itemPrice * 0.18;
        const totalPrice = deliveryCharges + itemPrice + taxPrice;
        const order = await Order.create({
            user: userId,
            orderItems: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                price: item.price,
                color: item.variant.color,
                size: item.variant.size,
                quantity: item.quantity
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice: itemPrice,
            taxPrice,
            shippingPrice: deliveryCharges,
            totalPrice
        })
        await order.save();
        cart.items = [];
        await cart.save();
        const invoice = await generateInvoice(order)
        await sendEmail(req.user.email, invoice, order)
        const response = new ApiResponse(order, 201, "Order created successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
     console.log(error)
        next(new ApiError([], error.stack, "An error occurred while creating the order", 500));
    }
})

export const placeOrder = asyncHandler(async (req, res, next) => {

})

export const updateStatus = asyncHandler(async (req, res, next) => {

})

export const getOrderById = asyncHandler(async (req, res, next) => {

})

export const getUserOrder = asyncHandler(async (req, res, next) => {

})

export const cancelOrder = asyncHandler(async (req, res, next) => {

})

export const updateShipping = asyncHandler(async (req, res, next) => {

})

export const trackOrder = asyncHandler(async (req, res, next) => {

})