import mongoose from "mongoose";
const salesModel=mongoose.Schema.ObjectId({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    variant:{
        size:String,
        color:String
    },
    quantity:{
        type:Number,
        required:true
    },
    salesDate:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        enum:["pending","complete"]
    }
},{
    timestamps:true
});
export const Sales=mongoose.model("Sale",salesModel);