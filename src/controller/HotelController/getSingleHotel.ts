import { Response, Request } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { CompanyResponse } from "../../types/CompanyModel";

const getSingleHotel = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { hotelId } = req.body;

    // Fetch hotel info by ID
    const hotelInfo = await CompanyModel.findById(hotelId) as CompanyResponse | null;
    if (!hotelInfo) {
      return sendErrorResponse(res, 404, "Hotel information not found.");
    }

    // Define response data
    const hotelInfoResponse = {
      _id: hotelInfo._id,
      email: hotelInfo.email,
      surname: hotelInfo.surname,
      companyName: hotelInfo.companyName,
      piva: hotelInfo.piva,
      address: hotelInfo.address,
      city: hotelInfo.city,
      pec: hotelInfo.pec,
      sdi: hotelInfo.sdi,
      name: hotelInfo.name,
    };

    return sendSuccessResponse(res, hotelInfoResponse, "Hotel information retrieved successfully.");
  } catch (error) {
    console.error("Error retrieving single hotel data:", error);
    return sendErrorResponse(res, 500, "An error occurred while retrieving hotel information.");
  }
};

export default getSingleHotel;
