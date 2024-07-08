import { 
    adminLogin, 
    getAllUser, 
    getAUser, 
    handleRefreshToken, 
    loginUser, 
    registeredUser, 
    resetPassword,
    forgotPassword, 
    updatePassword, 
    saveAddress, 
    logOut 
} from "../controller/UserController.js";
import express from 'express';
import { 
    loginValidation, 
    registerValidation,
    resetPassword1,
    forgotPassword1, 
    updatepassword 
} from "../middlewares/validator.middleware.js";
import {authMiddleware, isAdmin} from '../middlewares/auth.middleware.js'
import { User } from "../model/userSchema.js";
const Userroute=express.Router();
Userroute.post('/register',registerValidation,registeredUser);
Userroute.post('/login',loginValidation,loginUser);
Userroute.get('/refreshToken',handleRefreshToken);
Userroute.get('/get',getAllUser);
Userroute.post('/adminlogin',adminLogin);
Userroute.get('/get/:id',authMiddleware,getAUser);
Userroute.post('/resetPassword',resetPassword1,resetPassword);
Userroute.post('/forgotPassword',forgotPassword1,forgotPassword);
Userroute.put('/updatePassword',updatepassword,updatePassword);
Userroute.put('/saveAddress',saveAddress);
Userroute.get('/logout',logOut);
export default Userroute