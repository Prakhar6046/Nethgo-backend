import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const EditCityRoute = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      cityRouteId,
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
      
    const { effectiveAdminUserId } = await getEffectiveAdminUserId(req.user._id.toString());
    const adminUserId = effectiveAdminUserId;

    // Check if the city route with the given ID exists
    const existingRoute = await CityRouteModel.findById(cityRouteId);
    if (!existingRoute) {
      return sendErrorResponse(res, 404, "City route not found.");
    }

    // Prepare updated city route data
    const updatedRouteData = {
      adminUserId,
      from,
      to,
      averageTravelTime,
      driverCost,
      adminCost,
      cooperativeCost,
      ditteCost,
      totalPrice
    };

    // Update the city route entry in the database
    await CityRouteModel.updateOne({ _id: cityRouteId }, { $set: updatedRouteData });

    return sendSuccessWithoutResponse(res, "City route details updated successfully.");
    
  } catch (error) {
    console.error("Error while updating city route info:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while updating the city route information."
    );
  }
};

export default EditCityRoute;
