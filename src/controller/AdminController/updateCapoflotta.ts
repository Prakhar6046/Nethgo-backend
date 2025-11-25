import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminResponse } from "../../types/AdminTypeModel";

const updateCapoflotta = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, city, cityId, capoflottaId } = req.body;

    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    const creatorId = req.user._id;
    const creatorInfo: AdminResponse | null = await AdminModel.findById(creatorId);

    if (!creatorInfo) {
      return sendErrorResponse(res, 404, "Creator not found.");
    }

    if (!creatorInfo.superAdmin && creatorInfo.userType !== "admin") {
      return sendErrorResponse(
        res,
        403,
        "Only Admin or SuperAdmin can update Capoflotta."
      );
    }

    if (!capoflottaId) {
      return sendErrorResponse(res, 400, "Capoflotta ID is required.");
    }

    // Check if the Capoflotta exists
    const existingCapoflotta: AdminResponse | null = await AdminModel.findById(capoflottaId);
    if (!existingCapoflotta) {
      return sendErrorResponse(res, 404, "Capoflotta not found.");
    }

    // Verify it's actually a Capoflotta
    if (existingCapoflotta.userType !== "capoflotta") {
      return sendErrorResponse(
        res,
        400,
        "The specified user is not a Capoflotta."
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingCapoflotta.email) {
      const existingAdminUser = await AdminModel.findOne({ 
        email,
        _id: { $ne: capoflottaId }
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
    let hashedPassword = existingCapoflotta.password; // Retain existing password by default
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

    // Prepare updated Capoflotta data
    const updatedCapoflottaData = {
      email: email || existingCapoflotta.email,
      password: hashedPassword,
      city: city || existingCapoflotta.city,
      cityId: cityId || existingCapoflotta.cityId,
      parentId: existingCapoflotta.parentId || null,
    };

    // Update the Capoflotta in the database
    await AdminModel.updateOne(
      { _id: capoflottaId },
      { $set: updatedCapoflottaData }
    );

    return sendSuccessWithoutResponse(
      res,
      "Capoflotta updated successfully."
    );
  } catch (error) {
    console.error("Error updating Capoflotta:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while updating the Capoflotta."
    );
  }
};

export default updateCapoflotta;

