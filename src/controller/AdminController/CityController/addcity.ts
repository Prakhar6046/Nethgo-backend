import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/responseFun";
import { AdminResponse } from "../../../types/AdminTypeModel";
import { AdminModel } from "../../../models/AdminModel/Admin";
import { CityModel } from "../../../models/CityModel/CityModel";

const AddCity = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cityName } = req.body;

    // Validate request body
    if (!cityName || typeof cityName !== "string" || cityName.trim() === "") {
      return sendErrorResponse(res, 400, "City name is required and must be a valid string.");
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const superAdminId = req.user._id;
    const superAdminInfo: AdminResponse | null = await AdminModel.findById(superAdminId);

    // Check if admin info exists
    if (!superAdminInfo) {
      return sendErrorResponse(res, 404, "Admin user not found.");
    }

    // Ensure the user has super admin privileges
    if (!superAdminInfo.superAdmin) {
      return sendErrorResponse(res, 403, "You do not have permission to add a city.");
    }

    // Check for duplicate city entry
    const existingCity = await CityModel.findOne({ cityName: cityName.trim() });
    if (existingCity) {
      return sendErrorResponse(res, 409, `City "${cityName}" already exists.`);
    }

    // Create the new city
    const cityInfo = {
      cityName: cityName.trim(),
    };
    const newCity = await CityModel.create(cityInfo);

    // Respond with success
    return sendSuccessResponse(res, newCity, `City "${cityName}" has been added successfully.`);
  } catch (error) {
    console.error("Error during adding the city:", error);
    return sendErrorResponse(res, 500, "An error occurred while adding the city.");
  }
};

export default AddCity;
