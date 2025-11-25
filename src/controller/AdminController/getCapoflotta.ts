import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";

const getCapoflotta = async (req: Request, res: Response): Promise<Response> => {
  try {
  
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const adminId = req.user._id;
    const adminInfo: AdminResponse | null = await AdminModel.findById(adminId);

    if (!adminInfo) {
      return sendErrorResponse(res, 404, "Admin user not found.");
    }


    if (!adminInfo.superAdmin && adminInfo.userType !== "admin") {
      return sendErrorResponse(
        res,
        403,
        "You do not have permission to view Capoflotta data."
      );
    }

    const capoflottaUsers = await AdminModel.find({
      parentId: adminId,
      userType: "capoflotta",
    });

    return sendSuccessResponse(res, capoflottaUsers, "Capoflotta data retrieved successfully.");
  } catch (error) {
    console.error("Error fetching Capoflotta data:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching Capoflotta data.");
  }
};

export default getCapoflotta;

