import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
const CarDriverLogOut = async (req: Request, res: Response) => {
  try {
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

    await CarDriversModel.updateOne(
      { _id: DriverId },
      {
        $set: {
          isActive: false,
          fmcToken:""
        },
      }
    );
    // Construct response data without the password

    return sendSuccessWithoutResponse(res, "LogOut successful.");
  } catch (error) {
    sendErrorResponse(res, 500, "Error During LogOut Car Driver");
  }
};
export default CarDriverLogOut;
