import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productModel = mongoose.Schema({
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
        ref: 'Brand',
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
    ratingDistribution: {
        type: Map,
        of: Number,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
}, { timestamps: true });
productModel.plugin(mongoosePaginate);
export const Product = mongoose.model('Product', productModel);