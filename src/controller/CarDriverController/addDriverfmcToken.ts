import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun"; // Assuming `sendSuccessResponse` sends data with success
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";

const AddDriverFmcToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fmcToken } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized: User not authenticated."
      );
    }

    const driverId = req.user._id;

    // Validate required fields
    if (!fmcToken) {
      return sendErrorResponse(res, 400, "Missing required field: fmcToken.");
    }

    // Find the existing car driver
    const existingDriver: CarDriverResponse | null =
      await CarDriversModel.findById(driverId);
    if (!existingDriver) {
      return sendErrorResponse(res, 404, "Car driver not found.");
    }

    // Update the car driver in the database
    const updateResult = await CarDriversModel.updateOne(
      { _id: driverId },
      { $set: { fmcToken } }
    );

    // Send success response
    return sendSuccessWithoutResponse(
      res,
      "Car driver FMC token updated successfully."
    );
  } catch (error) {
    console.error("Error while updating car driver info:", error);
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error: Unable to update car driver information."
    );
  }
};

export default AddDriverFmcToken;
