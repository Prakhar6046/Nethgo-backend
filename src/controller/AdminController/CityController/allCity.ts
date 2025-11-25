import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/responseFun";
import { CityModel } from "../../../models/CityModel/CityModel";


const AllCity = async (req: Request, res: Response): Promise<Response> => {
  try {    
    // Fetch all citys 
    const CityInfo = await CityModel.find({});

    // Respond with the fetched data
    return sendSuccessResponse(res, CityInfo, "City data retrieved successfully.");
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return sendErrorResponse(res, 500, "An error occurred while fetching citys data.");
  }
};

export default AllCity;
