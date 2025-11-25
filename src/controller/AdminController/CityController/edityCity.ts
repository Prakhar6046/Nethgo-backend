import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/responseFun";
import { AdminResponse } from "../../../types/AdminTypeModel";
import { AdminModel } from "../../../models/AdminModel/Admin";
import { CityModel } from "../../../models/CityModel/CityModel";

const EditCity = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cityName, cityId } = req.body;

    // Validate request body
    if (!cityId || typeof cityId !== "string" || cityId.trim() === "") {
      return sendErrorResponse(res, 400, "City ID is required and must be a valid string.");
    }
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
      return sendErrorResponse(res, 403, "You do not have permission to edit a city.");
    }

    // Check if the city exists
    const cityToUpdate = await CityModel.findById(cityId);
    if (!cityToUpdate) {
      return sendErrorResponse(res, 404, `City with ID "${cityId}" not found.`);
    }

    // Check for duplicate city name
    const duplicateCity = await CityModel.findOne({ cityName: cityName.trim(), _id: { $ne: cityId } });
    if (duplicateCity) {
      return sendErrorResponse(res, 409, `City name "${cityName}" is already in use by another city.`);
    }

    // Update the city
    cityToUpdate.cityName = cityName.trim();
    await cityToUpdate.save();

    // Respond with success
    return sendSuccessResponse(res, cityToUpdate, `City "${cityName}" has been updated successfully.`);
  } catch (error) {
    console.error("Error during updating the city:", error);
    return sendErrorResponse(res, 500, "An error occurred while updating the city.");
  }
};

export default EditCity;
