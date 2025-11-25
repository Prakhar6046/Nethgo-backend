import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CityModel } from "../../models/CityModel/CityModel";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";

const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, city, cityId } = req.body;

    // Check if Admin already exists
    const existingAdminUser = await AdminModel.findOne({ email });
    const CompanyInfo = await CompanyModel.findOne({email})
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

    // Prepare new Admin data
    const newAdmin = {
      email,
      password: hashedPassword,  
      city,
      cityId
    };

    // Create new Admin in the database
    await AdminModel.create(newAdmin);
    await CityModel.updateOne({_id:cityId},{$set:{
      cityUsed:true
    }})
    return sendSuccessWithoutResponse(
      res,
      "Admin created successfully."
    );
  } catch (error) {

    return sendErrorResponse(
      res,
      500,
      "An error occurred while registering the Admin."
    );
  }
};
export const createSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if Admin or SuperAdmin with the email already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return sendErrorResponse(
        res,
        409,
        "An account with this email already exists."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = {
      email,
      password: hashedPassword,
      superAdmin: true,
    };

    await AdminModel.create(newSuperAdmin);

    return sendSuccessWithoutResponse(res, "Super Admin created successfully.");
  } catch (error) {
    console.error("Error creating super admin:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating the Super Admin."
    );
  }
};
export default registerAdmin;
