import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import bcrypt from "bcrypt";
import { CompanyResponse } from "../../types/CompanyModel";

const UpdateCompanyProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      password,
      name,
      surname,
      companyName,
      piva,
      address,
      city,
      pec,
      sdi,
    } = req.body;

    // Check if req.user is authenticated and has a valid _id
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. User not found.");
    }

    const userId = req.user._id;

    // Verify if the company profile exists
    const existingCompany: CompanyResponse | null = await CompanyModel.findById(userId);
    if (!existingCompany) {
      return sendErrorResponse(res, 404, "Company profile not found.");
    }
    let hashedPassword = existingCompany.password; // Retain existing password by default
    if (password && !(password === existingCompany.password)) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  
    // Update company profile details
    const updatedCompanyData = {
      companyName,
      name,
      email,
      password: hashedPassword,
      surname,
      piva,
      address,
      city,
      pec,
      sdi,
    };

    await CompanyModel.updateOne({ _id: userId }, { $set: updatedCompanyData });

    return sendSuccessWithoutResponse(
      res,
      "Company profile updated successfully."
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An unexpected error occurred while updating the company profile. Please try again."
    );
  }
};

export default UpdateCompanyProfile;
