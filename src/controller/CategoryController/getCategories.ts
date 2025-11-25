import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";

import { CategoryModel } from "../../models/CategoryModel/CategoryModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const getCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId } = await getEffectiveAdminUserId( req.user._id.toString());

    const categories = await CategoryModel.find({ adminUserId: effectiveAdminUserId });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return sendErrorResponse(res, 500, "Internal server error.");
  }
};

export default getCategories;
