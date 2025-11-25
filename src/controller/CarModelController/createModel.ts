import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CarModels } from "../../models/CarModel/CarModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const NewCarModel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { carType, targa, module, licenseNumber, cityOfService } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }
    
    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    // This ensures data created by Capoflotta is associated with their parent Admin
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Validate carType
    const validCarTypes = [4, 6, 8]; // Berlina, Van, Lusso
    if (!carType || !validCarTypes.includes(Number(carType))) {
      return sendErrorResponse(
        res,
        400,
        "Invalid car type. Must be 4 (Berlina), 6 (Van), or 8 (Lusso)."
      );
    }

    // Check if a car Model with the given tagra already exists
    const existingDriver = await CarModels.findOne({ targa });
    if (existingDriver) {
      return sendErrorResponse(
        res,
        409,
        "A car Model with this targa already exists."
      );
    }

    // Prepare new Car Model data
    const newDriverData = {
      adminUserId,
      carType,
      targa,
      module,
      licenseNumber,
      cityOfService,
    };

    // Create new car Model entry in the database
    await CarModels.create(newDriverData);
    return sendSuccessWithoutResponse(
      res,
      "New car Model created successfully."
    );
  } catch (error) {
    console.error("Error while adding car Model info:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while adding the car model information."
    );
  }
};

export default NewCarModel;
