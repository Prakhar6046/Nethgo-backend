import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/responseFun";
import { CityModel } from "../../../models/CityModel/CityModel";
import { AdminModel } from "../../../models/AdminModel/Admin";


const CitiesWithAdmins = async (req: Request, res: Response): Promise<Response> => {
  try {
    const cityIds = await AdminModel.distinct("cityId", { cityId: { $exists: true, $ne: null } });

    // Step 2: Find cities in CityModel whose _id is in cityIds array
    const cities = await CityModel.find({
      _id: { $in: cityIds }
    });
    return sendSuccessResponse(res, cities, "Cities with admins retrieved successfully.");
  } catch (error) {
    console.error("Error fetching cities with admins:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching cities with admins.");
  }
};

export default CitiesWithAdmins;
