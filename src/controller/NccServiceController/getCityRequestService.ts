import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";

const GetCityRequestService = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated and has a valid ID
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }
    const DriverId = req.user._id;
    const DriverInfo: CarDriverResponse | null = await CarDriversModel.findById(
      DriverId
    );

    // Validate required fields
    if (!DriverInfo) {
      return sendErrorResponse(
        res,
        400,
        "Missing required fields. City info not found"
      );
    }
    // Fetch all service requests for the authenticated user
    const allServiceRequests = await NccBookingModel.find({
      city: DriverInfo.cityOfService,
      driverAccept: false,
    }).sort({createdAt:-1});

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

export default GetCityRequestService;
