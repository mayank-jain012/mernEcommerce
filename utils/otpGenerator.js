import crypto from 'crypto';
import {Otp} from '../model/otpSchema.js';

export const otpGeneratorAndUpdate=async(email)=>{
    const otp=crypto.randomBytes(3).toString('hex')
    console.log(otp)
    const expiresAt=Date.now()+15*60*1000;
    await Otp.findOneAndUpdate(
        {email},
        {otp,expiresAt},
        {upsert:true,new:true}
    )
    return otp;
}
export const verifyOtp=async(email,otp)=>{
    const find=await Otp.findOne({email,otp})
    if(!find || find.expiresAt<Date.now()){
        return false;
    }
    await Otp.deleteOne({email,otp})
    return true;
}
