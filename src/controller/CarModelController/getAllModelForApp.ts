import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";

import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CarModels } from "../../models/CarModel/CarModel";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";

const AllAppCarModels = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const carDriverId = req.user._id;
    const CarDriverInfo: CarDriverResponse | null =
      await CarDriversModel.findById(carDriverId);
    const adminInfo: AdminResponse | null = await AdminModel.findOne({
      _id: CarDriverInfo?.adminUserId,
    });

    // Check if admin info exists
    if (!adminInfo) {
      return sendErrorResponse(res, 404, "Admin user not found.");
    }

    // Fetch all car Models for the authenticated admin's city
    const allCarModels = await CarModels.find({ adminUserId: adminInfo._id });
    if (!allCarModels.length) {
      return sendSuccessResponse(
        res,
        [],
        "No Car Models found for the specified city."
      );
    }

    // Send response with fetched data
    return sendSuccessResponse(
      res,
      allCarModels,
      "All Car Model Info retrieved successfully."
    );
  } catch (error) {
    console.error("Error while getting all car Models data:", error);
    return sendErrorResponse(
      res,
      500,
      "Error while getting all car Models data."
    );
  }
};

export default AllAppCarModels;
