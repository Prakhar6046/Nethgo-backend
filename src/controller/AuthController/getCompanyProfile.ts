import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,

} from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { CompanyResponse } from "../../types/CompanyModel";

const GetCompanyProfile = async (req: Request, res: Response): Promise<Response> => {
  try {

    // Check if req.user is authenticated and has a valid _id
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. User not found.");
    }

    const userId = req.user._id;

    // Verify if the company profile exists
    const company: CompanyResponse | null = await CompanyModel.findById(userId);
    if (!company) {
      return sendErrorResponse(res, 404, "Company profile not found.");
    }
    const companyToReturn = {
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
      };
   return sendSuccessResponse(res,companyToReturn, "Company Profile Data")
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An unexpected error occurred while getting the company profile. Please try again."
    );
  }
};

export default GetCompanyProfile;
