import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";

import { CategoryModel } from "../../models/CategoryModel/CategoryModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.body;

    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId } = await getEffectiveAdminUserId( req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Find the category and check admin ownership
    const category = await CategoryModel.findOne({ _id, adminUserId });
    if (!category) {
      return sendErrorResponse(res, 404, "Category not found or unauthorized");
    }

    await CategoryModel.findByIdAndDelete(_id);

    return sendSuccessWithoutResponse(res, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
