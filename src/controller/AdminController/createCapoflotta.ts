import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import bcrypt from "bcrypt";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminResponse } from "../../types/AdminTypeModel";

const createCapoflotta = async (req: Request, res: Response) => {
  try {
    const { email, password, city, cityId } = req.body;

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
        "Only Admin or SuperAdmin can create Capoflotta."
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

    const newCapoflotta = {
      email,
      password: hashedPassword,
      city,
      cityId,
      userType: "capoflotta",
      parentId: creatorId.toString(),
      superAdmin: false,
    };

    await AdminModel.create(newCapoflotta);
    return sendSuccessWithoutResponse(
      res,
      "Capoflotta created successfully."
    );
  } catch (error) {
    console.error("Error creating Capoflotta:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating the Capoflotta."
    );
  }
};

export default createCapoflotta;

