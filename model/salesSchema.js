import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const salesModel = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    variant: {
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice:{
        type:Number,
    },
    finalPrice:{
        type:Number,
    },
    salesDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "complete"],
        default: "pending"
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
salesModel.plugin(mongoosePaginate);
export const Sales = mongoose.model("Sales", salesModel);
