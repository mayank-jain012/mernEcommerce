import { Order } from "../model/OrderModel.js";
import { Cart } from '../model/cartModel.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { calculateShipping } from "../utils/shipRocket.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendEmail } from "../utils/sendEmail.js";
import {Sales} from '../model/salesSchema.js';
import { verifyPayment } from "../utils/verifyPayment.js";
import { Inventory } from "../model/inventoryModel.js";

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
        for (const item of cart.items) {
            const sale = await Sales.create({
                product: item.product._id,
                variant: {
                    size: item.variant.size,
                    color: item.variant.color
                },
                quantity: item.quantity,
                category: item.product.category,
                brand: item.product.brand
            });
            await sale.save();
        }
        for (const item of cart.items) {
            const inventoryItem = await Inventory.findOne({ product: item.product._id });
            if (inventoryItem) {
              inventoryItem.quantity -= item.quantity;
              if (inventoryItem.quantity < 0) {
                return next(new ApiError([], '', 'Insufficient stock for product', 400));
              }
              await inventoryItem.save();
            }
          }
        cart.items = [];
        await cart.save();
        const invoice = await generateInvoice(order)
        await sendEmail(req.user.email, invoice, order)
        if(paymentMethod==="Online"){
            const razorpayOrder = await razorpay.orders.create({
                amount: totalPrice * 100, // Amount in paise
                currency: 'INR',
                receipt: order._id.toString(),
            });

            // Respond with Razorpay order details
            res.json({
                success: true,
                orderId: razorpayOrder.id,
                currency: razorpayOrder.currency,
                amount: razorpayOrder.amount,
                key_id: process.env.RAZORPAY_KEY_ID
            });
        }else{
            const response = new ApiResponse(order, 201, "Order created successfully");
            res.status(response.statusCode).json(response);
        }
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

export const payment = asyncHandler(async(req,res,next)=>{
    const { paymentId, orderId, signature } = req.body;
    const secret = process.env.KEY_SECRET; 

    if (verifyPayment(orderId, paymentId, signature, secret)) {
        
        try {
            const order = await Order.findById(orderId);

            if (order) {
                order.paymentResult = {
                    id: paymentId,
                    status: 'paid',
                    update_time: new Date().toISOString(),
                    email_address: req.body.email
                };
                order.isPaid = true;
                order.paidAt = new Date();
                await order.save();

                const response =new ApiResponse(order,201,"Payment Successfull")
                res.status(response.statusCode).json(response)
            } else {
               return next(new ApiError([],"","Order Id not found",402))
            }
        } catch (error) {
            return next(new ApiError([],error.message,"Order Id not found",402))
        }
    } else {
        return next(new ApiError([],"","Invalid Signature",402))
    }
})

// calcultate average order value
// calculte customer retention rate