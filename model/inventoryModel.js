import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Variant',
    required:true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  restockThreshold: {
    type: Number,
    default: 10
  },
  warehouse:{
    type:String,
    default:'Budh Vihar, Delhi'
  },
  status: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock'
  }
}, {
  timestamps: true
});
// show response of the low stock
inventorySchema.methods.updateStatus=function(){
  if(this.quantity<=0){
    this.status='out-of-stock'
  }else if(this.quantity<this.restockThreshold){
    this.status='in-stock'
  }else{
    this.status='in-stock'
  }
}
export const Inventory = mongoose.model('Inventory', inventorySchema);
