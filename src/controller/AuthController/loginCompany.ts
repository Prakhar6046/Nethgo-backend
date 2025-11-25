import { Response, Request } from "express";
import bcrypt from "bcrypt";
import {
  getToken,
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CompanyResponse } from "../../types/CompanyModel";
import { AdminResponse } from "../../types/AdminTypeModel";

const loginCompany = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Check if user exists as a company or admin
    const company = (await CompanyModel.findOne({
      email,
    })) as CompanyResponse | null;
    const admin = (await AdminModel.findOne({ email })) as AdminResponse | null;
    const user = company || admin;

    if (!user) {
      return sendErrorResponse(res, 403, "Invalid email. No account found.");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 403, "Invalid password.");
    }

    // Generate JWT token
    const token = await getToken(user.email, user);

    // Construct response data without the password
    const userResponse = company
      ? {
          _id: company._id,
          email: company.email,
          surname: company.surname,
          companyName: company.companyName,
          piva: company.piva,
          address: company.address,
          city: company.city,
          pec: company.pec,
          sdi: company.sdi,
          name: company.name,
          token,
        }
      : {
          _id: admin!._id,
          email: admin!.email,
          superAdmin: admin!.superAdmin,
          city: admin!.city,
          cityId: admin!.cityId,
          userType: admin!.userType || (admin!.superAdmin ? undefined : "admin"),
          parentId: admin!.parentId || null,
          token,
        };

    return sendSuccessResponse(res, userResponse, "Login successful.");
  } catch (error) {
    console.error("Error during login:", error);
    return sendErrorResponse(res, 500, "An error occurred while logging in.");
  }
};

export default loginCompany;
