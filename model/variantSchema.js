import mongoose from "mongoose";
import { Inventory } from "./inventoryModel.js";
const variantModel = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
})
variantModel.pre('save',async function(next){
    if(!this.isModified('stock')){
        return next();
    }
    const inventory=await Inventory.findOne({variant:this._id});
    if(inventory){
        inventory.quantity=this.stock;
        inventory.updateStatus();
        await inventory.save();
    }else{
        await Inventory.create({
            product:this.product,
            variant:this._id,
            quantity:this.stock,
        })
    }
    next();
})
export const Variant = mongoose.model("Variant", variantModel);
