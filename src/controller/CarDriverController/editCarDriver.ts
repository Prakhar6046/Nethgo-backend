import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun"; // Assuming `sendSuccessResponse` sends data with success
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import { CarModels } from "../../models/CarModel/CarModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const EditCarDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      carDriverId,
      driverName,
      driverSurname,
      accessTheApp,
      driverEmail,
      driverPassword,
      cityOfService,
      licenseNumber,
      carModel,
      category,
    } = req.body;

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
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Validate required fields
    if (!carDriverId || !driverEmail || !driverName || !driverSurname) {
      return sendErrorResponse(
        res,
        400,
        "Missing required fields: carDriverId, driverEmail, driverName, and driverSurname"
      );
    }

    // Find the existing car driver
    const existingDriver: CarDriverResponse | null =
      await CarDriversModel.findById(carDriverId);
    if (!existingDriver) {
      return sendErrorResponse(res, 404, "Car driver not found.");
    }
      const existingCarId = existingDriver.carModel?.toString();
    const newCarId = carModel?.toString();

    let CarModel = null;
    if (newCarId && newCarId.trim() !== '') {
      CarModel = await CarModels.findById(newCarId);
      if (!CarModel) {
        return sendErrorResponse(res, 404, "Car Model not Found");
      }
    }

    if (existingCarId !== newCarId) {
      if (newCarId && newCarId.trim() !== '' && CarModel && CarModel.driverAssign && CarModel.driverId) {
        return sendErrorResponse(
          res,
          409,
          "This car is already assigned to another driver"
        );
      }
    }
    // Check for duplicate email
    const emailExists = await CarDriversModel.findOne({
      driverEmail,
      _id: { $ne: carDriverId },
    });
    if (emailExists) {
      return sendErrorResponse(
        res,
        409,
        "A car driver with this email already exists."
      );
    }

    let hashedPassword = existingDriver.driverPassword;
    if (driverPassword) {
      const isSame = await bcrypt.compare(
        driverPassword,
        existingDriver.driverPassword
      );
      if (!isSame) {
        hashedPassword = await bcrypt.hash(driverPassword, 10);
      }
    }

    // Prepare updated data
    const updatedDriverData: any = {
      adminUserId,
      driverName,
      driverSurname,
      accessTheApp,
      driverEmail,
      driverPassword: hashedPassword,
      cityOfService,
      licenseNumber,
      carType: CarModel?.carType ?? null,
      category,
    };

    // Only include carModel if it's provided and not empty
    if (carModel && carModel.trim() !== '') {
      updatedDriverData.carModel = carModel;
    } else {
      // If no car model is selected, set it to null to unassign any existing car
      updatedDriverData.carModel = null;
    }

    // Update the car driver in the database
    await CarDriversModel.findByIdAndUpdate(
      carDriverId,
      { $set: updatedDriverData },
      { new: true }
    );
    // If the driver was previously assigned to a different car, un‑assign it
    if (
      existingDriver.carModel &&
      existingDriver.carModel.toString() !== carModel
    ) {
      await CarModels.updateOne(
        { _id: existingDriver.carModel },
        { $set: { driverAssign: false, driverId: null } }
      );
    }
    // Only assign new car if a car model was selected
    if (carModel && carModel.trim() !== '' && CarModel) {
      await CarModels.updateOne(
        {
          _id: carModel,
        },
        {
          $set: {
            driverAssign: true,
            driverId: carDriverId,
          },
        }
      );
    }
    // Send success response with updated driver data
    return sendSuccessWithoutResponse(
      res,
      "Car driver details updated successfully."
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

export default EditCarDriver;
