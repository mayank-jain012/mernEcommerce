import mongoose from 'mongoose';

const blogCategorySchema = mongoose.Schema({
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
}, { timestamps: true });

export const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);
