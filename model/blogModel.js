import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const blogSchema = mongoose.Schema({
  title: {
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
    ref: 'BlogCategory',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount:{
    type:Number,
    default:0
  },
  disLikesCount:{
    type:Number,
    default:0
  }
}, { timestamps: true });
blogSchema.plugin(mongoosePaginate);
export const Blog = mongoose.model('Blog', blogSchema);
