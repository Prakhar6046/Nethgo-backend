import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";

const AllAdminsData = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const superAdminId = req.user._id;
    const superAdminInfo: AdminResponse | null = await AdminModel.findById(superAdminId);

    // Check if admin info exists
    if (!superAdminInfo) {
      return sendErrorResponse(res, 404, "Super admin user not found.");
    }

    // Ensure the user has super admin privileges
    if (!superAdminInfo.superAdmin) {
      return sendErrorResponse(res, 403, "You do not have permission to view admin data.");
    }

    // Fetch all admins excluding the current super admin
    const adminsInfo = await AdminModel.find({
      _id: { $ne: superAdminId }, 
      superAdmin: { $ne: true }
    });

    // Respond with the fetched data
    return sendSuccessResponse(res, adminsInfo, "Admin data retrieved successfully.");
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching admin data.");
  }
};

export default AllAdminsData;
