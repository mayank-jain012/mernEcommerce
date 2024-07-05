import { Product } from "../model/productSchema.js";
import { Variant } from "../model/variantSchema.js";
import slugify from 'slugify'
import { validationResult, body } from "express-validator";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = [
  upload.array('images', 10),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('variants').notEmpty().withMessage('Variants must be an array'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(errors.array(), "", "Validation Error", 400));
    }

    try {
      const { name, category, brand, description, variants } = req.body;
      console.log(name);
      const slug = slugify(name, { lower: true });
      const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      // Handling variants
      const savedVariants = await Promise.all(
        parsedVariants.map(async (variant) => {
          let newVariant = new Variant({
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
            images: variant.images
          });
          return await newVariant.save();
        })
      );

      // Creating product
      let product = new Product({
        name,
        slug,
        category,
        brand,
        description,
        variants: savedVariants.map(variant => variant._id),
        images: req.files.map(file => file.path)
      });
      // Saving product
      product = await product.save();
      const response = new ApiResponse(product, 201, "Product added successfully");
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.log(error);
      next(new ApiError([], error.stack, "An error occurred", 500));
    }
  }
];

