import mongoose from "mongoose";
const productModel=mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
    }],
    rating: {
        type: Number,
        default: 0,
    },
    totalRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const Product=mongoose.model('Product',productModel);