import mongoose from "mongoose";

const connection=async()=>{
    try {
        const url=process.env.MONGODB;
        if(!url){
            throw new Error("Mongodb Url not correct");
        }
        const path= await mongoose.connect(url);
        console.log("Mongodb Connected Sucessfully");
    } catch (error) {
        console.log("Mongodb not connected Successfully",error)
        process.exit(1)
    }
}
export default connection;