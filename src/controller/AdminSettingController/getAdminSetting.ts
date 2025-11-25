import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { AdminSettings } from "../../models/AdminSettingModel/AdminSettingModel";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";
const SingleAdminSetting = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }
    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    
    // Fetch admin settings for the effective admin
    const AdminSettingInfo = await AdminSettings.findOne({
      adminUserId: effectiveAdminUserId,
    });
    if (!AdminSettingInfo) {
      return sendSuccessResponse(
        res,
        {},
        "No Admin Settings found for the specified city."
      );
    }
    // Send response with fetched data
    return sendSuccessResponse(
      res,
      AdminSettingInfo,
      "Admin Settings Info retrieved successfully."
    );
  } catch (error) {
    console.error("Error while getting  Admin Settings data:", error);
    return sendErrorResponse(
      res,
      500,
      "Error while getting  Admin Settings data."
    );
  }
};
export const getSetting = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
    
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const CustomerId = req.user._id;
    const customerInfo = await CompanyModel.findById(CustomerId);
    if (!customerInfo) {
      return sendErrorResponse(res, 404, "Hotel Not found");
    }
    const adminInfo = await AdminModel.findOne({ cityId: customerInfo?.city });

    // Check if admin info exists
    if (!adminInfo) {
      return sendErrorResponse(res, 404, "Admin user not found.");
    }
    // Fetch all car Models for the authenticated admin's city
    const AdminSettingInfo = await AdminSettings.findOne({
      adminUserId: adminInfo._id,
    });
    if (!AdminSettingInfo) {
      return sendSuccessResponse(
        res,
        {},
        "No Admin Settings found for the specified city."
      );
    }
    return sendSuccessResponse(
      res,
      {
        admin: adminInfo,
        AdminSettingInfo,
      },
      "Admin and settings retrieved successfully."
    );
  } catch (error) {
    console.error("Error while getting  Admin Settings data:", error);
    return sendErrorResponse(
      res,
      500,
      "Error while getting  Admin Settings data."
    );
  }
};
export default SingleAdminSetting;
