import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { CarModels } from "../../models/CarModel/CarModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const AllCarModels = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(
      req.user._id.toString()
    );

    // Fetch all car Models for the effective admin (filtered by city)
    const allCarModels = await CarModels.find({
      adminUserId: effectiveAdminUserId,
      cityOfService: adminInfo.cityId,
    });

    // Send response with fetched data
    return sendSuccessResponse(res, allCarModels, "All Car Model Info retrieved successfully.");
  } catch (error: any) {
    console.error("Error while getting all car Models data:", error);
    return sendErrorResponse(
      res,
      error.message === "Admin user not found." ? 404 : 500,
      error.message || "Error while getting all car Models data."
    );
  }
};

export default AllCarModels;
