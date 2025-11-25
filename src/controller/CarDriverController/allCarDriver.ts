import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const AllCarDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(
      req.user._id.toString()
    );  

    // Fetch all car drivers for the effective admin (filtered by city)
    const allCarDrivers = await CarDriversModel.find({
      adminUserId: effectiveAdminUserId,
      cityOfService: adminInfo.cityId,
    }).populate("carModel");

    return sendSuccessResponse(
      res,
      allCarDrivers,
      "All Car Driver Info retrieved successfully."
    );
  } catch (error: any) {
    console.error("Error while getting all car driver data:", error);
    return sendErrorResponse(
      res,
      error.message === "Admin user not found." ? 404 : 500,
      error.message || "Error while getting all car driver data."
    );
  }
};

export default AllCarDriver;
