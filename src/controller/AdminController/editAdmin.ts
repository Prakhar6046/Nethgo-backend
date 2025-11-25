import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { AdminResponse } from "../../types/AdminTypeModel";
import { CityModel } from "../../models/CityModel/CityModel";

const EditAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      password,
      confirmPassword,
      city,
      adminId,
      newCityId,
      oldCityId,
    } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    // Check if the admin with the given ID exists
    const existingAdmin: AdminResponse | null = await AdminModel.findById(
      adminId
    );
    if (!existingAdmin) {
      return sendErrorResponse(res, 404, "Admin not found.");
    }

    // Check if an admin with the same email already exists (excluding the current admin being edited)
    const emailExists: AdminResponse | null = await AdminModel.findOne({
      email,
      _id: { $ne: adminId },
    });
    if (emailExists) {
      return sendErrorResponse(
        res,
        409,
        "An admin with this email already exists."
      );
    }
    let hashedPassword = existingAdmin.password; // Retain existing password by default
    if (password) {
      if (password !== confirmPassword) {
        return sendErrorResponse(
          res,
          400,
          "Password and Confirm Password do not match."
        );
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Hash the password if provided, or retain the existing password

    // Prepare updated admin data
    const updatedAdminData = {
      email: email || existingAdmin.email, // Retain existing email if not updated
      password: hashedPassword,
      city: city || existingAdmin.city, // Retain existing city if not updated
    };

    // Update the admin entry in the database
    await AdminModel.updateOne({ _id: adminId }, { $set: updatedAdminData });
    await CityModel.updateOne(
      { _id: newCityId },
      {
        $set: {
          cityUsed: true,
        },
      }
    );
    await CityModel.updateOne(
      { _id: oldCityId },
      {
        $set: {
          cityUsed: true,
        },
      }
    );

    return sendSuccessWithoutResponse(
      res,
      "Admin details updated successfully."
    );
  } catch (error) {
    console.error("Error while updating admin info:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while updating admin information."
    );
  }
};

export default EditAdmin;
