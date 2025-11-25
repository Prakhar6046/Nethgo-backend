import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";

import { CategoryModel } from "../../models/CategoryModel/CategoryModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { category } = req.body;
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Check if this adminUserId already has the same category
    const existingCategory = await CategoryModel.findOne({
      adminUserId,
      category,
    });

    if (existingCategory) {
      return sendErrorResponse(
        res,
        400,
        "Category already exists for this admin."
      );
    }

    // Save the new category for this admin user
    const newCategory = new CategoryModel({ category, adminUserId });
    await newCategory.save();

    return sendSuccessWithoutResponse(res, "Category created successfully.");
  } catch (error) {
    console.error("Error creating category:", error);
    return sendErrorResponse(res, 500, "Internal server error.");
  }
};

export default createCategory;
