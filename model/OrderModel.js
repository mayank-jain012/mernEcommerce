import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, { _id: false });

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        address: { 
            type: String, 
            // required: true 
        },
        shippingCode: { 
            type: String, 
            // required: true 
        },
        postalCode: { 
            type: String, 
            required: true 
        },
        state: { 
            type: String, 
             required: true 
        },
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    paymentResult: {
        id: { 
            type: String 
        },
        status: { 
            type: String 
        },
        update_time: { 
            type: String 
        },
        email_address: { 
            type: String 
        },
    },
    itemsPrice: { 
        type: Number, 
        default: 0.0 
    },
    taxPrice: { 
        type: Number, 
        default: 0.0
     },
    shippingPrice: { 
        type: Number, 
        default: 0.0 
    },
    totalPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    isPaid: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    paidAt: { 
        type: Date 
    },
    isDelivered: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    deliveredAt: { 
        type: Date 
    },
    status: {
        type: String,
        required: true,
        default: 'processing',
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
