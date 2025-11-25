import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";

const GetSingleOrderService = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User authentication failed. Please log in to continue.");
    }

    const orderId = req.params.orderId;

    // Validate the provided orderId
    if (!orderId) {
      return sendErrorResponse(res, 400, "Order ID is required to fetch the order details.");
    }

    // Fetch the order details
    const singleOrder = await NccBookingModel.findOne({ _id: orderId });

    if (!singleOrder) {
      return sendErrorResponse(
        res,
        404,
        `No order found with ID: ${orderId}. Please check and try again.`
      );
    }

    // Return the order details if found
    return sendSuccessResponse(
      res,
      singleOrder,
      "Order details retrieved successfully."
    );
  } catch (error) {
    console.error("Error fetching single order:", error);

    return sendErrorResponse(
      res,
      500,
      "An unexpected error occurred while retrieving the order details. Please try again later."
    );
  }
};

export default GetSingleOrderService;
