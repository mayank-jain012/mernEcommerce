import mongoose from "mongoose";

const replaceSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  originalVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true
  },
  newVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant'
  },
  reason: {
    type: String,
    required: true,
    enum: ['damaged', 'not as described', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'approved', 'rejected'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['return', 'replace']
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

export const Replace = mongoose.model("Replace", replaceSchema);
