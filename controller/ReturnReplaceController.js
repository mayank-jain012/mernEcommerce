import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Replace } from "../model/returnReplaceModel.js";
import { Inventory } from "../model/inventoryModel.js";
import { Sales } from "../model/salesSchema.js";
import { getEmailTemplate, sendEmail } from "../utils/sendEmail.js";
export const createReplaceRequest = asyncHandler(async (req, res, next) => {
  const { order, product, originalSize,originalColor, newSize,newColor, reason, type } = req.body;
  const userId = req.user._id;
  try {
    const replaceRequest = await Replace.create({
      order,
      user: userId,
      product,
      originalSize,
      originalColor,
      newSize,
      newColor,
      reason,
      type
    });
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
// Controller to handle replace/return requests
export const handleReplaceRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const replaceRequest = await Replace.findById(id).populate('user product originalSize originalColor newSize newColor');
    if (!replaceRequest) {
      return next(new ApiError([], '', 'Replace request not found', 404));
    }
   

    

 replaceRequest.status = status;

    if (status === 'approved') {
      replaceRequest.completionDate = Date.now();

      if (replaceRequest.type === 'return') {
        await Sales.updateOne(
          { product: replaceRequest.product._id, 'variant.size': replaceRequest.originalSize._id, 'variant.color': replaceRequest.originalColor._id },
          { $inc: { quantity: -1 } }
        );

        await Inventory.updateOne(
          { product: replaceRequest.product._id, 'variant.size': replaceRequest.originalSize._id, 'variant.color': replaceRequest.originalColor._id },
          { $inc: { quantity: 1 } }
        );

        const emailData = await getEmailTemplate('return', {
          email: replaceRequest.user.email,
          orderId: replaceRequest.order,
          productName: replaceRequest.product.name,
          oldSize: replaceRequest.originalSize.size,
          oldColor: replaceRequest.originalColor.color
        });

        await sendEmail(replaceRequest.user.email, emailData.subject, emailData.text, emailData.html);
      } 
      else if (replaceRequest.type === 'replace') {
        console.log(replaceRequest.newSize)
        console.log(replaceRequest.newColor)
        if (replaceRequest.newSize && replaceRequest.newColor) {
          await Sales.updateOne(
            { product: replaceRequest.product._id, 'variant.size': replaceRequest.originalSize._id, 'variant.color': replaceRequest.originalColor._id },
            { $inc: { quantity: -1 } }
          );
          await Inventory.updateOne(
            { product: replaceRequest.product._id, 'variant.size': replaceRequest.originalSize._id, 'variant.color': replaceRequest.originalColor._id },
            { $inc: { quantity: 1 } }
          );
          await Sales.updateOne(
            { product: replaceRequest.product._id, 'variant.size': replaceRequest.newSize._id, 'variant.color': replaceRequest.newColor._id },
            { $inc: { quantity: 1 } }
          );
          await Inventory.updateOne(
            { product: replaceRequest.product._id, 'variant.size': replaceRequest.newSize._id, 'variant.color': replaceRequest.newColor._id },
            { $inc: { quantity: -1 } }
          );
          const emailData = await getEmailTemplate('replace', {
            email: replaceRequest.user.email,
            orderId: replaceRequest.order,
            productName: replaceRequest.product.name,
            oldSize: replaceRequest.originalSize.size,
            oldColor: replaceRequest.originalColor.color,
            newSize: replaceRequest.newSize.size,
            newColor: replaceRequest.newColor.color
          });
          await sendEmail(replaceRequest.user.email, emailData.subject, emailData.text, emailData.html);
        } 
        else {
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

