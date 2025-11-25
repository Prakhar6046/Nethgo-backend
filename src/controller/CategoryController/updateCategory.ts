import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";

import { CategoryModel } from "../../models/CategoryModel/CategoryModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { category, _id } = req.body;

    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId } = await getEffectiveAdminUserId( req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Check if category exists and belongs to the effective admin
    const existingCategory = await CategoryModel.findOne({ _id, adminUserId });
    if (!existingCategory) {
      return sendErrorResponse(res, 404, "Category not found or unauthorized");
    }

    existingCategory.category = category;
    await existingCategory.save();

    return sendSuccessWithoutResponse(res, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

export default updateCategory;
