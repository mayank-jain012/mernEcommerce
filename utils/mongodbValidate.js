import mongoose from 'mongoose';
const ObjectId=mongoose.Types.ObjectId;
const isValidate=(id)=>{
    if(ObjectId.isValid(id)){
        if((String) (new ObjectId(id))==id){
            return true;
        }
        return false;
    }
    return false;
}
export {isValidate};