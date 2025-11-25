import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminResponse } from "../../types/AdminTypeModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const updateDittaIndividuale = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, city, cityId, dittaIndividualeId } = req.body;

    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    // Get original user info for permission checks
    const originalUserInfo: AdminResponse | null = await AdminModel.findById(req.user._id.toString());
    if (!originalUserInfo) {
      return sendErrorResponse(res, 404, "User not found.");
    }

    // Get effective adminUserId (parent Admin's ID for Capoflotta)
    // This ensures data updated by Capoflotta is associated with their parent Admin
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());

    if (
      !originalUserInfo.superAdmin &&
      originalUserInfo.userType !== "admin" &&
      originalUserInfo.userType !== "capoflotta"
    ) {
      return sendErrorResponse(
        res,
        403,
        "Only Admin, SuperAdmin, or Capoflotta can update Ditta individuale."
      );
    }

    if (!dittaIndividualeId) {
      return sendErrorResponse(res, 400, "Ditta individuale ID is required.");
    }

    // Check if the Ditta individuale exists
    const existingDittaIndividuale: AdminResponse | null = await AdminModel.findById(dittaIndividualeId);
    if (!existingDittaIndividuale) {
      return sendErrorResponse(res, 404, "Ditta individuale not found.");
    }

    // Verify it's actually a Ditta individuale
    if (existingDittaIndividuale.userType !== "ditta_individuale") {
      return sendErrorResponse(
        res,
        400,
        "The specified user is not a Ditta individuale."
      );
    }

    // Verify ownership: Ditta individuale must belong to the effective admin (parent admin for Capoflotta)
    if (existingDittaIndividuale.parentId !== effectiveAdminUserId) {
      return sendErrorResponse(
        res,
        403,
        "You can only update Ditta individuale that belong to you."
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingDittaIndividuale.email) {
      const existingAdminUser = await AdminModel.findOne({ 
        email,
        _id: { $ne: dittaIndividualeId }
      });
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
    }

    // Handle password update (only if provided)
    let hashedPassword = existingDittaIndividuale.password; // Retain existing password by default
    if (password) {
      if (!confirmPassword) {
        return sendErrorResponse(
          res,
          400,
          "Confirm password is required when updating password."
        );
      }
      if (password !== confirmPassword) {
        return sendErrorResponse(
          res,
          400,
          "Password and Confirm Password do not match."
        );
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Prepare updated Ditta individuale data
    const updatedDittaIndividualeData = {
      email: email || existingDittaIndividuale.email,
      password: hashedPassword,
      city: city || existingDittaIndividuale.city,
      cityId: cityId || existingDittaIndividuale.cityId,
      parentId: existingDittaIndividuale.parentId || null,
    };

    // Update the Ditta individuale in the database
    await AdminModel.updateOne(
      { _id: dittaIndividualeId },
      { $set: updatedDittaIndividualeData }
    );

    return sendSuccessWithoutResponse(
      res,
      "Ditta individuale updated successfully."
    );
  } catch (error) {
    console.error("Error updating Ditta individuale:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while updating the Ditta individuale."
    );
  }
};

export default updateDittaIndividuale;

