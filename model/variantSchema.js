import mongoose from "mongoose";
const variantModel = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",

        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",

        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
})
export const Variant = mongoose.model("Variant", variantModel);
