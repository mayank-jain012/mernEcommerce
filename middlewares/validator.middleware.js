import { body } from "express-validator";
import { User } from "../model/userSchema.js";
import { upload } from './multer.middleware.js'
// auth validation start
export const registerValidation = [
    body('firstname')
        .notEmpty().withMessage("First Name is Required")
        .isString().withMessage("First Name Should be a String"),
    body('lastname')
        .notEmpty().withMessage("Last Name is required")
        .isString().withMessage("LastName Should be a String"),
    body('mobileno')
        .notEmpty().withMessage("Mobile No is required")
        .isMobilePhone().withMessage("Invalid Mobile No")
        .custom(async (value, { req }) => {
            return await User.findOne({ mobileno: value }).then(user => {
                if (user) {
                    return Promise.reject("Mobile number already exist")
                }
            })
        }),
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid Email")
        .custom(async (value, { req }) => {
            return await User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject("Email already exist")
                }
            })
        }),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Length of the password must be 6")
]
export const loginValidation = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid Email"),
    body("password")
        .notEmpty().withMessage("Password is required")
]
export const forgotPassword1 = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid Email")
]
export const resetPassword1 = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid Email"),
    body("otp")
        .notEmpty().withMessage("Otp is required"),
    body("password")
        .notEmpty().withMessage("password must be required")
        .isLength({ min: 6 }).withMessage("Password length must be atleast 6 character long")
]
export const updatepassword = [
    body('password')
        .notEmpty().withMessage("Password must be required")
        .isLength({ min: 6 }).withMessage("Password lenght must be atleast 6 character long")
]
// auth validation end

// size,color,brand,category,blog category start here
export const size = [
    body('name')
        .notEmpty().withMessage("Size Must be required")
]

// size,color,brand,category,blog category end here

// blog validation start here
export const validateBlog = [
    body('title')
        .not().isEmpty().withMessage('Title is required'),
    body('category')
        .not().isEmpty().withMessage('Category is required'),
    body('content')
        .not().isEmpty().withMessage('Content is required'),
    body('author')
        .not().isEmpty().withMessage('Author is required'),
];
