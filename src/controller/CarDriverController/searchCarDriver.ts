import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const SearchCarDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const carType = (req.params as any).carType;
    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());

    // Build query
    const query: any = {
      adminUserId: effectiveAdminUserId,
      cityOfService: adminInfo.cityId,
    };
    
    // Add carType filter if provided
    if (carType) {
      query.carType = carType;
    }

    // Fetch all car drivers for the effective admin (filtered by city and carType)
    const allCarDrivers = await CarDriversModel.find(query);

    if (!allCarDrivers.length) {
      return sendSuccessResponse(res, [], "No Car Drivers found for the specified city.");
    }

    // Send response with fetched data
    return sendSuccessResponse(res, allCarDrivers, "All Car Driver Info retrieved successfully.");
  } catch (error) {
    console.error("Error while getting all car driver data:", error);
    return sendErrorResponse(res, 500, "Error while getting all car driver data.");
  }
};

export default SearchCarDriver;
