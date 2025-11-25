import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import bcrypt from "bcrypt";
import AddDriverEmail from "../../middleware/email/addDriverEmail";
import { CarModels } from "../../models/CarModel/CarModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const NewCarDriver = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      driverName,
      driverSurname,
      accessTheApp,
      carModel,
      driverEmail,
      driverPassword,
      cityOfService,
      category,
    } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }
    
    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    // This ensures data created by Capoflotta is associated with their parent Admin
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminUserId = effectiveAdminUserId;
    // Check if a car driver with the given email already exists
    const existingDriver = await CarDriversModel.findOne({ driverEmail });
    if (existingDriver) {
      return sendErrorResponse(
        res,
        409,
        "A car driver with this email already exists."
      );
    }
    let CarModel = null;
    if (carModel && carModel.trim() !== '') {
      CarModel = await CarModels.findById(carModel);
      if (!CarModel) {
        return sendErrorResponse(res, 404, "Car Model not Found ");
      }
      if (CarModel.driverAssign && CarModel.driverId) {
        return sendErrorResponse(
          res,
          409,
          "This car is already assigned to another driver"
        );
      }
    }
    // Hash the driver password
    const hashedPassword = await bcrypt.hash(driverPassword, 10);

    // Prepare new driver data
    const newDriverData: any = {
      adminUserId,
      driverName,
      driverSurname,
      accessTheApp,
      driverEmail,
      driverPassword: hashedPassword,
      cityOfService,
      carType: CarModel?.carType ?? null,
      category,
    };

    // Set carModel - either the provided value or null if empty
    if (carModel && carModel.trim() !== '') {
      newDriverData.carModel = carModel;
    } else {
      newDriverData.carModel = null;
    }

    // Create new car driver entry in the database
    const NewDriver = await CarDriversModel.create(newDriverData);
    
    // Only assign car if a car model was selected
    if (carModel && carModel.trim() !== '' && CarModel) {
      CarModel.driverAssign = true;
      CarModel.driverId = NewDriver._id.toString();
      await CarModel.save();
    }
    await AddDriverEmail(driverEmail, driverPassword, res);
    return sendSuccessWithoutResponse(
      res,
      "New car driver created successfully."
    );
  } catch (error) {
    console.error("Error while adding car driver info:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while adding the car driver information."
    );
  }
};

export default NewCarDriver;
