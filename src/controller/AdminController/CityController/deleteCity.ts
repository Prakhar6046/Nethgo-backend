import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../../utils/responseFun";
import { CityModel } from "../../../models/CityModel/CityModel";
import { CompanyModel } from "../../../models/CompanyModel/CompanyModel";

const DeleteCity = async (req: Request, res: Response) => {
  try {
    const { cityId } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    // Validate City  ID is provided
    if (!cityId) {
      return sendErrorResponse(res, 400, "City  ID is required");
    }

    // Check if the City  exists
    const cityInfo = await CityModel.findById(cityId);
    if (!cityInfo) {
      return sendErrorResponse(res, 404, "City not found");
    }
    const companyUsingCity = await CompanyModel.findOne({ city: cityId });
    if (companyUsingCity) {
      return sendErrorResponse(
        res,
        409,
        "Cannot delete city. It is being used by one or more companies."
      );
    }

    // Remove the City
    await CityModel.deleteOne({ _id: cityId });
    return sendSuccessWithoutResponse(res, "City  removed successfully");
  } catch (error) {
    console.error("Error removing City :", error);
    sendErrorResponse(res, 500, "An error occurred while removing the City ");
  }
};

export default DeleteCity;
