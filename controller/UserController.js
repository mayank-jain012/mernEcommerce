import JsonWebToken from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../model/userSchema.js';
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import { ApiResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';
import { generateRefreshtoken } from '../configure/refreshToken.js';
import { token } from '../configure/jwtToken.js'
import jwt from 'jsonwebtoken';
import { isValidate } from '../utils/mongodbValidate.js';
import { registrationEmailTemplate, loginEmailTemplate, forgotPasswordContent } from '../utils/emailContent.js';
import { verifyOtp, otpGeneratorAndUpdate } from '../utils/otpGenerator.js'
import { sendEmail } from '../utils/sendEmail.js';
import { getEmailTemplate } from '../utils/sendEmail.js';
export const registeredUser = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array(), "", "Validation Error", 400))
    }
    const { firstname, lastname, password, email, mobileno, role } = req?.body;
    try {
        const existedUser = await User?.findOne({ $or: [{ email }, { mobileno }] })
        if (existedUser) {
            return next(new ApiError([], "", "User already Exist", 400))
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email,
            mobileno,
            password: hashedPassword,
            role: role
        })
        await user.save();
       
        const emailData = getEmailTemplate('signup', { user });
        await sendEmail(email, (await emailData).subject, (await emailData).text, (await emailData).html);
       
        res.status(201).json(new ApiResponse(user, 201, "User Registered Successfully"))
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An error occurred", 500))
    }
})
export const handleRefreshToken = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        return next(new ApiError([], "", "Not refresh Token in cookie", 400))
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        return new ApiError([], "", "No refresh Token in db or not matched", 400)
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            return next(new ApiError([], "", "There is something wrong in refresh token"))
        }
        const accessToken = generateRefreshtoken(user?._id);
        res.json({ accessToken });
    });
})
export const loginUser = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array(), "", "Validation Error", 400))
    }
    const { email, password } = req?.body;
    try {
        const findUser = await User.findOne({ email })

        if (!findUser || !(await findUser.isPasswordMatched(password))) {
            return next(new ApiError([], "", "Invalid Email Or Password", 400))
        }

        const refreshToken = generateRefreshtoken(findUser?.id);

        await User.findByIdAndUpdate(findUser?.id, { refreshToken: refreshToken }, { new: true })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const gettoken = token(findUser?._id);
        const response = new ApiResponse({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobileno: findUser?.mobileno,
            token: gettoken
        }, 201, "Login Successfully")
        res.status(response.statusCode).json(response)
        const emailData = getEmailTemplate('login', { findUser });
        await sendEmail(email,(await emailData).subject, (await emailData).text, (await emailData).html);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An Error Occurred", 500))
    }
})
export const adminLogin = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(error.array, "", "Validation error", 501);
    }
    const { email, password } = req.body;
    try {
        const findAdmin = await User.findOne({ email });
        if (!findAdmin || !(await findAdmin.isPasswordMatched(password))) {
            next(new ApiError([], "", "Your Email and Password not be valid", 501))
        }
        const refreshToken = generateRefreshtoken(findAdmin?._id);
        await User.findByIdAndUpdate(findAdmin?._id, { refreshToken: refreshToken }, { new: true })
        res.cookie("refreshToken", refreshToken, {
            maxAge: 72 * 60 * 60 * 1000,
            httpOnly: true
        })

        const getToken = token(findAdmin?._id);
        const response = new ApiResponse({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            mobileno: findAdmin?.mobileno,
            email: findAdmin?.email,
            role: "admin",
            token: getToken
        })
        res.status(response.statusCode).json(response)
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An error occurred", 501))
    }
})
export const getAllUser = asyncHandler(async (req, res, next) => {
    const findUser = await User.find();
    try {
        if (!findUser) {
            return next(new ApiError([], "", "Not a single user exist", 404))
        }
        const user = new ApiResponse(findUser, 201, "All Existing Users");
        res.status(user.statusCode).json(user);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error.stack, "An error Occurred", 500))
    }
})
export const getAUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    isValidate(id);
    try {
        const user = await User.findById(id);
        if (!user) {
            return next(new ApiError([], "", "User not found", 500));
        }
        const data = new ApiResponse(user, 201, "User exist");
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error)
        next(new ApiError([], error, "An error Occurred", 500))
    }
})
export const resetPassword = asyncHandler(async (req, res, next) => {
    // express validator
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array(), "", "Validation Error", 402))
    }
    // collect data
    const { email, otp, password } = req.body;
    try {
        const validOtp = verifyOtp(email, otp);
        if (!validOtp) {
            return next(new ApiError([], "", "Invalid Otp or expired", 402))
        }
        // fetch mongo
        const exist = await User.findOne({ email });
        exist.password = await bcrypt.hash(password, 10);
        exist.passwordResetIn = undefined;
        await exist.save();
        const response = new ApiResponse({}, "201", "Password reset Successfully")
        res.status(response.statusCode).json(response)
    } catch (error) {
        next(new ApiError([], error.stack, "Error Occured", 501))
    }


})
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array(), "", "Validation Error", 400))
    }
    const { email } = req.body;
    try {
        const exist = await User.findOne({ email });
        if (!exist) {
            return next(new ApiError([], "", "The user does not exist", 402))
        }

        const emailData = getEmailTemplate('forgotPassword', { exist });
        await sendEmail(email, (await emailData).subject, (await emailData).text, (await emailData).html);
        const response = new ApiResponse({}, 200, "Otp sent Successfully")
        res.status(response.statusCode).json(response);

    } catch (error) {
        next(new ApiError([], error.stack, "An Error Occurred", 501))
    }
})
export const logOut = asyncHandler(async (req, res, next) => {
    //get cookies
    const { cookies } = req.cookies;
    // check exist
    if (!cookies.refreshToken) {
        return next([], "", "No refresh token attached", 402)
    }
    const refreshToken = cookies.refreshToken;
    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie(refreshToken, {
                httpOnly: true,
                secure: true
            })
            return res.status(204).json(new ApiResponse({}, 204, "NO user found with this token"))
        }
        await User.findOneAndUpdate(refreshToken, { refreshToken: "" }, { new: true })
        res.clearCookie(refreshToken, {
            httpOnly: true,
            secure: true
        })
    } catch (error) {
        next(new ApiError([], "", "An error Occurred", 501))
    }


    // find 
    // update
    // clear

})
export const updatePassword = asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new ApiError(error.array(), "", "Validation Error", 400))
    }
    const { _id } = req.user;
    const { password } = req.body;
    isValidate(_id);

    try {
        const user = await User.findById({ _id });
        if (!user) {
            return next(new ApiError([], "", "The user does not exist or a Token does not match the database", 402))
        }
        user.password = password
        await user.save();
        const updatedData = new ApiResponse("", 200, "Password reset Successfully", 201);
        res.status(updatedData.statusCode).json(updatedData);
    } catch (error) {
        next(new ApiError([], error.stack, "An error occured", 501));
    }

})
export const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    isValidate(_id);
    try {
        const user = await User.findByIdAndUpdate(_id,
            {
                address: req?.body?.address
            },
            { new: true })
        await user.save();
        const address = new ApiResponse("", 201, "Add adress successfully")
        res.status(address.statusCode).json(address);
    } catch (error) {
        next(new ApiError([], error.stack, "An error occurred", 501));
    }
})
// get user purchase history
export const purchaseHistory = asyncHandler(async (req, res, next) => {

})
// get user engagement rate
export const engagementRate = asyncHandler(async (req, res, next) => {

})
//get top spending user
export const topSpendingUser = asyncHandler(async (req, res, next) => {

})
// get customer retention rate
export const customerRetentionRate = asyncHandler(async (req, res, next) => {

})
