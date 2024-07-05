import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, { timestamps: true });

export const Size = mongoose.model('Size', sizeSchema);
