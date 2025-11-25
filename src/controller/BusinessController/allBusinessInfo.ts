import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { BusinessModel } from "../../models/BusinessModel/businessModel";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CityBusinessModel } from "../../models/BusinessModel/cityBusinessModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const GetBusinessInfo = async (req: Request, res: Response) => {
    try {

    if (!req.user || !req.user._id) {
        return sendErrorResponse(res, 401, "User not authenticated.");
      }
      let effectiveAdminUserId: string;
      let adminInfo: AdminResponse;
      
      try {
        const result = await getEffectiveAdminUserId(req.user._id.toString());
        effectiveAdminUserId = result.effectiveAdminUserId;
        adminInfo = result.adminInfo;
      } catch (error) {
        console.error(`[GetBusinessInfo] Error getting effective admin user ID:`, error);
        const directAdmin = await AdminModel.findById(req.user._id);
        if (!directAdmin) {
          return sendErrorResponse(res, 404, "Admin user not found");
        }
        effectiveAdminUserId = directAdmin._id.toString();
        adminInfo = directAdmin as any;
      }
      const adminExists: AdminResponse | null = await AdminModel.findById(effectiveAdminUserId);
      if(!adminExists){
        return sendSuccessResponse(res, {}, "Admin info not found");
      }
      
      let businessInfo;
      if(adminExists?.superAdmin){
        businessInfo = await BusinessModel.findOne({});
        return sendSuccessResponse(res, businessInfo, "Business information retrieved successfully");
      }

      let userType: "admin" | "cooperative" | "ditta_individuale" = "admin";

      const loggedInUser: AdminResponse | null = await AdminModel.findById(req.user._id);
      if (loggedInUser) {
        if (loggedInUser.userType === "capoflotta") {
          userType = "cooperative";
        } else if (loggedInUser.userType === "ditta_individuale") {
          userType = "ditta_individuale";
        } else {
          userType = "admin";
        }
      }

      businessInfo = await CityBusinessModel.findOne({
        city: adminInfo.cityId,
        userType: userType,
        adminUserId: effectiveAdminUserId
      });
      
      if (!businessInfo && adminInfo.cityId) {
        businessInfo = await CityBusinessModel.findOne({
          city: adminInfo.cityId,
          userType: userType,
          adminUserId: adminInfo.cityId
        });
      }
      
      if (!businessInfo) {
        businessInfo = await CityBusinessModel.findOne({
          city: adminInfo.cityId,
          userType: userType
        });
      }
    
        if (!businessInfo) {
            return sendSuccessResponse(res, {}, "No business information found");
        }
        return sendSuccessResponse(res, businessInfo, "Business information retrieved successfully");
    } catch (error) {
        console.error("Error fetching business info:", error);
        return sendErrorResponse(res, 500, "An error occurred while retrieving business information");
    }
};

export default GetBusinessInfo;
