import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    images: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
