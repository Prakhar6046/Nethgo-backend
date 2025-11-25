import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,

} from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";

const GetAllServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated and has a valid ID
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const userId = req.user._id;

    // Fetch all service requests for the authenticated user
    const allServiceRequests = await NccBookingModel.find({
      companyId: userId,
    });

    if (!allServiceRequests || allServiceRequests.length === 0) {
      return sendSuccessResponse(
        res,
        allServiceRequests,
        "No service request found."
      );
    }

    // Return all service requests if found
    return sendSuccessResponse(
      res,
      allServiceRequests,
      "All service requests retrieved successfully."
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An error occurred while retrieving service requests."
    );
  }
};

export default GetAllServices;
