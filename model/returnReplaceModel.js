import mongoose from "mongoose";
const replace=new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    variant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Variant',
        required:true
    },
    reason:{
        type:String,
        required:true,
        enum:['damaged','not as described','other']
    },
    status:{
        type:String,
        enum:['pending','completed','aproved','rejected'],
        default:'pending'
    },
    type:{
        type:String,
        enum:['return','replace']
    },
    requestDate:{

    },
    completionDate:{

    }
},{
    timestamps:true
})