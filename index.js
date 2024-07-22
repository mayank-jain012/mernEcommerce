import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT;
import connection from './database/mongodb.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Userroute from './routes/User.route.js';
import { errorHandler } from './middlewares/errorHandling.middleware.js';
import productRoute from './routes/Product.route.js';
import SizeRoute from './routes/Size.route.js';
import ColorRoutes from './routes/Color.route.js';
import BrandRoutes from './routes/Brand.route.js'
import CategoryRoute from './routes/Category.route.js'
import BlogCategoryRoute from './routes/BlogCategory.route.js'
import BlogRoute from './routes/Blog.route.js';
import CouponRoute from './routes/Coupon.route.js';
import VariantRoute from './routes/Variant.route.js';
import RatingRoute from './routes/rating.route.js';
import WishListRoute from './routes/Wishlist.route.js';
import CartRoute from './routes/Cart.route.js';
import OrderRoute from './routes/Order.route.js';
import InventoryRoute from './routes/Inventory.route.js';
app.use(cors({
    origin:process.env.CROSS_ORIGIN,
    credentials:true
}))
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(express.json({limit:"16kb"}))
app.use('/api/user',Userroute);
app.use('/api/product',productRoute);
app.use('/api/size',SizeRoute);
app.use('/api/color',ColorRoutes);
app.use('/api/brand',BrandRoutes);
app.use('/api/category',CategoryRoute);
app.use('/api/blogcategory',BlogCategoryRoute);
app.use('/api/blog',BlogRoute);
app.use('/api/coupon',CouponRoute);
app.use('/api/variant',VariantRoute);
app.use('/api/rating',RatingRoute);
app.use('/api/wishlist',WishListRoute);
app.use('/api/cart',CartRoute);
app.use('/api/order',OrderRoute);
app.use('/api/inventory',InventoryRoute);
app.use(errorHandler);
connection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running Sucessfully ${PORT}`)
        })
    })
    .catch((error) => {
        throw new error("Server not Running", error);
    })
