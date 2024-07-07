import { body,checkSchema } from "express-validator";
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
// blog validation end here
// coupon model start here
export const couponValidation=[
    body('code')
        .notEmpty().withMessage("Coupon Code is required")
        .isString().withMessage("Coupon Must Be String"),
    body('expiry')
        .notEmpty().withMessage("Expiry Date is required")
        .isDate().withMessage("Enter the Value in Date Format"),
    body("discount")
        .notEmpty().withMessage("Discount is required")
        .isNumeric().withMessage("Discount always in number")
]
// coupon model end here

// product validation start here
export const validateProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('variants').trim().notEmpty().withMessage("Variant is required"),
    // body('variants').custom((value, { req }) => {
    //     if (typeof value === 'string') {
    //         try {
    //             req.body.variants = JSON.parse(value);
    //         } catch (error) {
    //             throw new Error('Invalid JSON in variants field');
    //         }
    //     }
    //     return true;
    // }),
    // checkSchema({
    //     // 'variants': {
    //     //     isArray: {
    //     //         errorMessage: 'Variants should be an array',
    //     //         options: { min: 1 },
    //     //     },
    //     //     custom: {
    //     //         options: (value) => {
    //     //             for (const variant of value) {
    //     //                 if (!variant.size || !variant.color || !variant.price || !variant.stock || !variant.images) {
    //     //                     throw new Error('All fields in variants are required');
    //     //                 }
    //     //                 if (!Array.isArray(variant.images)) {
    //     //                     throw new Error('Images should be an array');
    //     //                 }
    //     //             }
    //     //             return true;
    //     //         },
    //     //     },
    //     // },
    //     'variants.*.size': {
    //         isMongoId: true,
    //         errorMessage: 'Invalid size ID',
    //     },
    //     'variants.*.color': {
    //         isMongoId: true,
    //         errorMessage: 'Invalid color ID',
    //     },
    //     'variants.*.price': {
    //         isFloat: {
    //             options: { min: 0 },
    //             errorMessage: 'Price should be a number greater than or equal to 0',
    //         },
    //     },
    //     'variants.*.stock': {
    //         isInt: {
    //             options: { min: 0 },
    //             errorMessage: 'Stock should be an integer greater than or equal to 0',
    //         },
    //     },
    //     'variants.*.images': {
    //         isArray: true,
    //         errorMessage: 'Images should be an array',
    //     },
    //     'variants.*.images.*': {
    //         isString: true,
    //         errorMessage: 'Each image should be a string',
    //     },
    // }),
];
;
