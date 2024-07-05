import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.finalPrice = this.totalPrice - this.discount;
  next();
});

export const Cart = mongoose.model('Cart', cartSchema);
