import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";



const GetSingleAcceptedOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User authentication failed. Please log in to continue.");
    }

    const acceptedOrderId = req.params.acceptedOrderId;
   
    // Validate the provided orderId
    if (!acceptedOrderId) {
      return sendErrorResponse(res, 400, "Order ID is required to fetch the order details.");
    }

    // Fetch the order details
    const singleOrder = await NccBookingModel.findOne({ _id: acceptedOrderId });

    if (!singleOrder) {
      return sendErrorResponse(
        res,
        404,
        `No order found with ID: ${acceptedOrderId}. Please check and try again.`
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

export default GetSingleAcceptedOrder;
