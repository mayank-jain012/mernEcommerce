
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from '../utils/cloudinary.js'

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'products',
        allowedFormats:['jpeg','png','jpg'],
        //  public_id:(req,file)=>file.orignalname
    }
})
export const upload=multer({storage:storage});