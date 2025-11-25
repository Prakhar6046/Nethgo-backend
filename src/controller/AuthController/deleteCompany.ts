import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";

const deleteCompanyInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const userId = req.user._id;

    // Delete company info and associated bookings
    await CompanyModel.deleteOne({ _id: userId });
    await NccBookingModel.deleteMany({ CompanyId: userId });

    return sendSuccessWithoutResponse(res, "Account deleted successfully.");
  } catch (error) {
    console.error("Error during account deletion:", error);
    return sendErrorResponse(res, 500, "An error occurred while deleting the account.");
  }
};

export default deleteCompanyInfo;
