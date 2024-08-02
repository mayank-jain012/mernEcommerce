import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  isNewUser: {
    type: Boolean,
    default: true,
  },
  pageViews: {
    type: Number,
    default: 1,
  },
  sessionDuration: {
    type: Number, // in seconds
    default: 0,
  },
}, { timestamps: true });

export const Visitor = mongoose.model('Visitor', visitorSchema);
