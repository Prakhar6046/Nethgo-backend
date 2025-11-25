import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminModel } from "../../models/AdminModel/Admin";
const registerCompany = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      surname,
      companyName,
      piva,
      address,
      city,
      name,
      pec,
      sdi,
    } = req.body;

    // Check if origination already exists
    const existingOrigination = await CompanyModel.findOne({ email });
    const AdminInfo =await AdminModel.findOne({email})
    if (existingOrigination) {
      return sendErrorResponse(
        res,
        409,
        "An account with this email already exists."
      );
    }
    if (AdminInfo) {
      return sendErrorResponse(
        res,
        409,
        "An account with this email already exists ."
      );
    }

    // Generate and hash a random password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare new origination data
    const newOrigination = {
      email,
      password: hashedPassword,
      surname,
      name,
      companyName,
      piva,
      address,
      city,
      pec,
      sdi,
    };

    // Create new origination in the database
    await CompanyModel.create(newOrigination);

    return sendSuccessWithoutResponse(
      res,
      "Company Data created successfully."
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An error occurred while registering the Company."
    );
  }
};

export default registerCompany;
