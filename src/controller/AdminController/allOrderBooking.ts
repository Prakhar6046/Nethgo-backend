import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const AllOrderBooking = async (req: Request, res: Response) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. Please log in.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());

    // Fetch all order bookings based on the effective admin's city
    const allOrderBookings = await NccBookingModel.find({ city: adminInfo.cityId });

    // Send success response with booking data
    return sendSuccessResponse(
      res,
      allOrderBookings,
      "All booking orders retrieved successfully."
    );
  } catch (error: any) {
    console.error("Error fetching all booking orders:", error);
    return sendErrorResponse(
      res,
      error.message === "Admin user not found." ? 404 : 500,
      error.message || "An error occurred while retrieving booking orders."
    );
  }
};

export default AllOrderBooking;
