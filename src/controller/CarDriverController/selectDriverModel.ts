import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import { CarModels } from "../../models/CarModel/CarModel";
import mongoose from "mongoose";

const SelectDriverModel = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { carModel } = req.body;
    if (!carModel || !mongoose.Types.ObjectId.isValid(carModel)) {
      return sendErrorResponse(res, 400, "Invalid or missing carModel.");
    }
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
    const CarModel = await CarModels.findById(carModel);
    if (DriverInfo.carModel !== carModel) {
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

    // Update the car driver in the database
    await CarDriversModel.findByIdAndUpdate(
      DriverId,
      { $set: { carModel: carModel, carType: CarModel?.carType ?? null } },
      { new: true }
    );
    // If the driver was previously assigned to a different car, un‑assign it
    if (DriverInfo.carModel && DriverInfo.carModel.toString() !== carModel) {
      await CarModels.updateOne(
        { _id: DriverInfo.carModel },
        { $set: { driverAssign: false, driverId: null } }
      );
    }
    await CarModels.updateOne(
      {
        _id: carModel,
      },
      {
        $set: {
          driverAssign: true,
          driverId: DriverId,
        },
      }
    );
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

export default SelectDriverModel;
