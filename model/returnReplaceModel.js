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
  originalSize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size',
    required: true
  },
  originalColor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true
  },
  newSize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size'
  },
  newColor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color'
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
