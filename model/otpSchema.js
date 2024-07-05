
import mongoose from 'mongoose';
// Declare the Schema of the Mongo model
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        expires:300,
        default:Date.now(),
    }
},{
    timestamps:true
});

//Export the model
export const Otp=mongoose.model('Otp',otpSchema)