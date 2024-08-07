import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Replace } from "../model/returnReplaceModel.js";
import { Inventory } from "../model/inventoryModel.js";
import { Sales } from "../model/salesSchema.js";
import { getEmailTemplate, sendEmail } from "../utils/sendEmail.js";
export const createReplaceRequest = asyncHandler(async (req, res, next) => {
  const { order, product, originalVariant, newVariant, reason, type } = req.body;
  const userId = req.user._id;

  try {
    const replaceRequest = await Replace.create({
      order,
      user: userId,
      product,
      originalVariant,
      newVariant,
      reason,
      type
    });
    if (type = "replace") {

    } else {

    }
    const response = new ApiResponse(replaceRequest, 201, 'Replace request created successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, 'An error occurred while creating the replace request', 500));
  }
});

export const deleteReplaceRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const replaceRequest = await Replace.findById(id);

    if (!replaceRequest) {
      return next(new ApiError([], '', 'Replace request not found', 404));
    }

    await replaceRequest.remove();

    const response = new ApiResponse({}, 200, 'Replace request deleted successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, 'An error occurred while deleting the replace request', 500));
  }
});

export const getReplaceRequestById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const replaceRequest = await Replace.findById(id).populate('order user product variant');

    if (!replaceRequest) {
      return next(new ApiError([], '', 'Replace request not found', 404));
    }

    const response = new ApiResponse(replaceRequest, 200, 'Replace request retrieved successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, 'An error occurred while retrieving the replace request', 500));
  }
});

export const getAllReplaceRequests = asyncHandler(async (req, res, next) => {
  try {
    const replaceRequests = await Replace.find().populate('order user product variant');
    const response = new ApiResponse(replaceRequests, 200, 'All replace requests retrieved successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, 'An error occurred while retrieving replace requests', 500));
  }
});

export const handleReplaceRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const replaceRequest = await Replace.findById(id).populate('user product originalVariant newVariant');

    if (!replaceRequest) {
      return next(new ApiError([], '', 'Replace request not found', 404));
    }

    const requestDate = new Date(replaceRequest.requestDate);
    const currentDate = new Date();
    const timeDiff = currentDate - requestDate;
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff > 7) {
      return next(new ApiError([], '', 'Request is older than 7 days', 400));
    }

    replaceRequest.status = status;

    if (status === 'approved') {
      replaceRequest.completionDate = Date.now();

      if (replaceRequest.type === 'return') {
        await Sales.updateOne(
          { product: replaceRequest.product._id, 'variant.variantId': replaceRequest.originalVariant._id },
          { $inc: { quantity: -1 } }
        );

        await Inventory.updateOne(
          { product: replaceRequest.product._id, variant: replaceRequest.originalVariant._id },
          { $inc: { quantity: 1 } }
        );
        const obj={
          email:replaceRequest.user.email,
          orderId: replaceRequest.order,
          productName: replaceRequest.product.name,
          variantSize: replaceRequest.originalVariant.size,
          variantColor:replaceRequest.originalVariant.color
        }
        const emailData=getEmailTemplate('replace',obj)
        await sendEmail(obj.email,(await emailData).subject,(await emailData).text,(await emailData).html)
        // await sendReturnEmail(replaceRequest.user.email, {
        //   orderId: replaceRequest.order,
        //   productName: replaceRequest.product.name,
        //   variant: `${replaceRequest.originalVariant.size} / ${replaceRequest.originalVariant.color}`
        // });
      } else if (replaceRequest.type === 'replace') {
        if (replaceRequest.newVariant) {
          await Sales.updateOne(
            { product: replaceRequest.product._id, 'variant.variantId': replaceRequest.originalVariant._id },
            { $inc: { quantity: -1 } }
          );

          await Inventory.updateOne(
            { product: replaceRequest.product._id, variant: replaceRequest.originalVariant._id },
            { $inc: { quantity: 1 } }
          );

          await Sales.updateOne(
            { product: replaceRequest.product._id, 'variant.variantId': replaceRequest.newVariant._id },
            { $inc: { quantity: 1 } }
          );

          await Inventory.updateOne(
            { product: replaceRequest.product._id, variant: replaceRequest.newVariant._id },
            { $inc: { quantity: -1 } }
          );
          const obj2={
            email:replaceRequest.user.email,
            orderId: replaceRequest.order,
            productName: replaceRequest.product.name,
            oldVariantSize:replaceRequest.originalVariant.size,
            oldVariantColor:replaceRequest.originalVariant.color,
            newVariantSize:replaceRequest.newVariant.size,
            newVariantColor:replaceRequest.newVariant.color
          }
          const emailValue=getEmailTemplate('return',obj2)
          await sendEmail(email,(await emailValue).subject,(await emailValue).text,(await emailValue).html)
          // await sendReplaceEmail(replaceRequest.user.email, {
          //   orderId: replaceRequest.order,
          //   productName: replaceRequest.product.name,
          //   oldVariant: `${replaceRequest.originalVariant.size} / ${replaceRequest.originalVariant.color}`,
          //   newVariant: `${replaceRequest.newVariant.size} / ${replaceRequest.newVariant.color}`
          // });
        } else {
          return next(new ApiError([], '', 'New variant is required for replacement', 400));
        }
      }
    }

    await replaceRequest.save();

    const response = new ApiResponse(replaceRequest, 200, 'Replace request status updated successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ApiError([], error.stack, 'An error occurred while updating the replace request status', 500));
  }
});