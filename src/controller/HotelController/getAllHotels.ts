import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { AdminResponse } from "../../types/AdminTypeModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const GetAllHotels = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }
    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminExists: AdminResponse | null = await AdminModel.findById(effectiveAdminUserId);
    
    if(adminExists?.superAdmin){
      const allHotelsData = await CompanyModel.find({});
      return sendSuccessResponse(res, allHotelsData, "All hotel data retrieved successfully.");
    }
    
    // Fetch hotels filtered by effective admin's city
    const cityRouteFilter = { city: adminInfo.cityId };
    // Fetch all hotel data
    const allHotels = await CompanyModel.find(cityRouteFilter);

    // Send response with the list of all hotels
    return sendSuccessResponse(res, allHotels, "All hotel data retrieved successfully.");
  } catch (error) {
    console.error("Error while retrieving all hotel details:", error);
    return sendErrorResponse(res, 500, "An error occurred while retrieving hotel details.");
  }
};

export default GetAllHotels;
