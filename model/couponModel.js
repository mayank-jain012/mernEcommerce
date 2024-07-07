import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiry:{
    type:Date,
    required:true
  }
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', couponSchema);


