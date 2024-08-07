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
    type: Number,
    default: 0,
  },
  pagesVisited: {
    type: [String], 
    default: [],
  },
}, { timestamps: true });


visitorSchema.index({ ipAddress: 1 });
visitorSchema.index({ visitDate: 1 });

export const Visitor = mongoose.model('Visitor', visitorSchema);
