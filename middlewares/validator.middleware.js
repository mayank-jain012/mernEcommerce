import { body,checkSchema ,param} from "express-validator";
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
];
export const validateUpdateProduct = [
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('brand').optional().isMongoId().withMessage('Invalid brand ID'),
    body('description').optional().trim().notEmpty().withMessage('Description is required'),
  ];
// product validation end here
// variant start here
export const validateVariant = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('size').isMongoId().withMessage('Invalid size ID'),
  body('color').isMongoId().withMessage('Invalid color ID'),
  body('price').isFloat({ min: 0 }).withMessage('Price should be a number greater than or equal to 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock should be an integer greater than or equal to 0'),
];
export const validateUpdateVariant = [
    body('size').optional().isMongoId().withMessage('Invalid size ID'),
    body('color').optional().isMongoId().withMessage('Invalid color ID'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price should be a number greater than or equal to 0'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock should be an integer greater than or equal to 0'),
    body('images').optional().isArray().withMessage('Images should be an array'),
    body('images.*').optional().isString().withMessage('Each image should be a string'),
  ];
// variant end here

// rating start here
export const validateCreateRating = [
    // body('user').isMongoId().withMessage('Invalid product ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating should be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
  ];

export const validateUpdateRating=[
    param('id').isMongoId().withMessage("Invalid Id"),
    body('rating').isInt({min:1,max:5}).withMessage("Rating Should be between 1 and 5"),
    body('coment').optional().isString().withMessage("Comment always a string")
]
export const validateDeleteRating=[
    param('id').isMongoId().withMessage("Invalid Id")
]
// rating end here
//wishlist start here
export const validationWishlist=[
    body('items').isArray().withMessage("Items Should be an array").custom((items)=>{
        if(!items || items.length==0){
            throw new Error("Atleat One Item required")
        }
        for(const item of items){
            if(!item.productId){
                throw new Error("ProductId is required for each item")
            }
        }
        return true;
    })
]
export const validateRemoveFromWishlist = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('variantId').optional().isMongoId().withMessage('Invalid Variant ID')
];
// wishlist end here

// cart start here

export const validationCreateCart=[
    body('variantId').isMongoId().withMessage('Invalid id'),
    body('productId').isMongoId().withMessage('Invalid id'),
    body('quantity').notEmpty().withMessage("Quantity is required").isNumeric().withMessage("Quantity must be a number")
]
export const validationRemoveCart=[
    body('variantId').isMongoId().withMessage('Invalid id'),
    body('productId').isMongoId().withMessage('Invalid id')
]
export const validationApplyCouponCart=[
    body('couponCode').notEmpty().withMessage("Coupon Code is Mandatory").isString().withMessage("Coupon Code Must Be a String")
]
export const validationCreateOrder=[
    body('paymentMethod').notEmpty().withMessage("Payment Method is Required"),
    body('shippingAddress').notEmpty().withMessage("Shipping Address is Required"),
    body('shippingAddress.postalCode').notEmpty().withMessage("Shipping Address is Required"),
    body('shipping.address').notEmpty().withMessage("Shipping Address is Required"),
    body('shippingAddress.state').notEmpty().withMessage("Shipping Address is Required"),
]
export const updateStatusOrder=[
    body('status').notEmpty().isIn(['processing','shipped','delivered','cancelled']).withMessage("Status Must Be Required or Invalid Status")
]
export const cancelOrderStatus=[
    body('reason').notEmpty().withMessage("Reason is required")
]
export const getSaleByDate=[
body('startDate').optional().isDate().withMessage(" Date is a invalid"),
body('endDate').optional().isDate().withMessage(" Date is invalid")
]
