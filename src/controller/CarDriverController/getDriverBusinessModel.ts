import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { DriverBusinessModel } from "../../models/DriverBusinessModel/driverBusiness";

const getDriverBusiness = async (req: Request, res: Response) => {
  try {
    // Ensure user authentication
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. Please log in.");
    }

    const driverId = req.user._id;

    // Fetch driver business information
    const driverBusinessInfo = await DriverBusinessModel.findOne({ driverId });

    if (!driverBusinessInfo) {
      return sendErrorResponse(res, 404, "Driver business information not found.");
    }

    // Return success response with the driver business information
    return sendSuccessResponse(
      res,
      driverBusinessInfo,
      "Driver business information retrieved successfully."
    );
  } catch (error) {
    console.error("Error fetching driver business information:", error);

    // Send generic error response for unexpected issues
    return sendErrorResponse(res, 500, "An error occurred while fetching driver business information.");
  }
};

export default getDriverBusiness;
