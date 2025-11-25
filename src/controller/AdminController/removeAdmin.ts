import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CityModel } from "../../models/CityModel/CityModel";

const RemoveAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { removeAdminId, cityId } = req.body;

    // Validate request body
    if (
      !removeAdminId ||
      typeof removeAdminId !== "string" ||
      removeAdminId.trim() === ""
    ) {
      return sendErrorResponse(
        res,
        400,
        "Admin ID is required and must be a valid string."
      );
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const superAdminId = req.user._id;
    const superAdminInfo: AdminResponse | null = await AdminModel.findById(
      superAdminId
    );

    // Check if admin info exists
    if (!superAdminInfo) {
      return sendErrorResponse(res, 404, "Super admin user not found.");
    }

    // Ensure the user has super admin privileges
    if (!superAdminInfo.superAdmin) {
      return sendErrorResponse(
        res,
        403,
        "You do not have permission to remove an admin."
      );
    }

    // Check if the admin to be removed exists
    const adminToRemove = await AdminModel.findById(removeAdminId);
    if (!adminToRemove) {
      return sendErrorResponse(res, 404, `Admin  not found.`);
    }

    // Delete the admin
    await AdminModel.deleteOne({ _id: removeAdminId });
    const cityUpdateResult = await CityModel.updateOne(
      { _id: cityId },
      { $set: { cityUsed: false } }
    );
    // Respond with success
    return sendSuccessWithoutResponse(
      res,
      `Admin has been successfully removed.`
    );
  } catch (error) {
    console.error("Error during removing the admin:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while removing the admin."
    );
  }
};

export default RemoveAdmin;
