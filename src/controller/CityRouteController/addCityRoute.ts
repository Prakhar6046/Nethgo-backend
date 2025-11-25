import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const NewCityRoute = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      from,
      to,
      averageTravelTime,
      driverCost,
      adminCost,
      cooperativeCost,
      ditteCost,
      totalPrice
    } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }
    

    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());
    
    // Prepare new city route data
    const newCityRoute = {
      adminUserId: effectiveAdminUserId,
      from,
      to,
      averageTravelTime,
      driverCost,
      adminCost,
      cooperativeCost,
      ditteCost,
      totalPrice,
      city: adminInfo.cityId
    };

    // Create new city route entry in the database
    await CityRouteModel.create(newCityRoute);

    return sendSuccessWithoutResponse(res, "New city route created successfully.");
    
  } catch (error) {
    console.error("Error while adding city route info:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating the city route."
    );
  }
};

export default NewCityRoute;
