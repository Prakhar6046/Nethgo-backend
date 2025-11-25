import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";


const GetAllDriverAcceptedOrder = async (req: Request, res: Response) => {
  try {
    // Check for authenticated user
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. Please log in.");
    }

    const driverId = req.user._id;

    // Fetch all accepted orders for the driver
    const acceptedOrders = await NccBookingModel.find({ driverId , driverAccept:true}).sort({driveAcceptDate:-1});

    // Return appropriate response
    if (!acceptedOrders || acceptedOrders.length === 0) {
      return sendSuccessResponse(res, [], "No accepted orders found.");
    }
    return sendSuccessResponse(res, acceptedOrders, "Accepted orders retrieved successfully.");
  } catch (error) {
    console.error("Error retrieving accepted orders:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching accepted orders.");
  }
};

export default GetAllDriverAcceptedOrder;
