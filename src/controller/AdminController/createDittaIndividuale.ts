import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const createDittaIndividuale = async (req: Request, res: Response) => {
  try {
    const { email, password, city, cityId } = req.body;
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    // Get original user info for permission checks
    const originalUserInfo = await AdminModel.findById(req.user._id.toString());
    if (!originalUserInfo) {
      return sendErrorResponse(res, 404, "User not found.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    // This ensures data created by Capoflotta is associated with their parent Admin
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());

    if (
      !originalUserInfo.superAdmin &&
      originalUserInfo.userType !== "admin" &&
      originalUserInfo.userType !== "capoflotta"
    ) {
      return sendErrorResponse(
        res,
        403,
        "Only Admin, SuperAdmin, or Capoflotta can create Ditta individuale."
      );
    }

    const existingAdminUser = await AdminModel.findOne({ email });
    const CompanyInfo = await CompanyModel.findOne({ email });
    if (existingAdminUser) {
      return sendErrorResponse(
        res,
        409,
        "An account with this email already exists."
      );
    }
    if (CompanyInfo) {
      return sendErrorResponse(
        res,
        409,
        "An account with this email already exists."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare new Ditta individuale data
    const newDittaIndividuale = {
      email,
      password: hashedPassword,
      city,
      cityId,
      userType: "ditta_individuale",
      parentId: effectiveAdminUserId,
      superAdmin: false,
    };

    // Create new Ditta individuale in the database
    await AdminModel.create(newDittaIndividuale);
    return sendSuccessWithoutResponse(
      res,
      "Ditta individuale created successfully."
    );
  } catch (error) {
    console.error("Error creating Ditta individuale:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating the Ditta individuale."
    );
  }
};

export default createDittaIndividuale;

