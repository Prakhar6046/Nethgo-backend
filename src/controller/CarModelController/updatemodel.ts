import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun"; // Assuming `sendSuccessResponse` sends data with success

import { CarDriverResponse } from "../../types/carDriverTypeModel";
import { CarModels } from "../../models/CarModel/CarModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const EditCarModel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { carModelId, carType, targa, module, licenseNumber, cityOfService } =
      req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized: User not authenticated"
      );
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    // This ensures data edited by Capoflotta is associated with their parent Admin
    const { effectiveAdminUserId } = await getEffectiveAdminUserId( req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Validate required fields
    if (!carType || !targa || !module || !carModelId) {
      return sendErrorResponse(
        res,
        400,
        "Missing required fields: carModelId, carType, module, and targa"
      );
    }

    // Validate carType
    const validCarTypes = [4, 6, 8]; // Berlina, Van, Lusso
    if (!validCarTypes.includes(Number(carType))) {
      return sendErrorResponse(
        res,
        400,
        "Invalid car type. Must be 4 (Berlina), 6 (Van), or 8 (Lusso)."
      );
    }

    // Find the existing car Model
    const existingDriver: CarDriverResponse | null = await CarModels.findById(
      carModelId
    );
    if (!existingDriver) {
      return sendErrorResponse(res, 404, "Car driver not found.");
    }

    // Check for duplicate email
    const emailExists = await CarModels.findOne({
      targa,
      _id: { $ne: carModelId },
    });
    if (emailExists) {
      return sendErrorResponse(
        res,
        409,
        "A car Model with this targa already exists."
      );
    }

    // Prepare updated data
    const updatedDriverData = {
      adminUserId,
      carType,
      targa,
      module,
      licenseNumber,
      cityOfService,
    };

    // Update the car Model in the database
    await CarModels.findByIdAndUpdate(
      carModelId,
      { $set: updatedDriverData },
      { new: true }
    );

    // Send success response with updated Car Model data
    return sendSuccessWithoutResponse(
      res,
      "Car Model details updated successfully."
    );
  } catch (error) {
    console.error("Error while updating car Model info:", error);
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error: Unable to update car Model information."
    );
  }
};

export default EditCarModel;
