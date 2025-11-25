import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { AdminModel } from "../../models/AdminModel/Admin";
import { AdminResponse } from "../../types/AdminTypeModel";

const getDittaIndividuale = async (req: Request, res: Response): Promise<Response> => {
  try {

    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const adminId = req.user._id;
    const adminInfo: AdminResponse | null = await AdminModel.findById(adminId);

    if (!adminInfo) {
      return sendErrorResponse(res, 404, "Admin user not found.");
    }

    // If userType is Capoflotta, use its parentId to get admin model data
    const effectiveAdminId = adminInfo.userType === "capoflotta" && adminInfo.parentId
      ? adminInfo.parentId
      : adminId;

    const dittaUsers = await AdminModel.find({
      parentId: effectiveAdminId,
      userType: "ditta_individuale",
    });


    return sendSuccessResponse(
      res,
      dittaUsers,
      "Ditta individuale users retrieved successfully."
    );

  } catch (error) {
    console.error("Error fetching Ditta individuale data:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching Ditta individuale data.");
  }
};

export default getDittaIndividuale;
