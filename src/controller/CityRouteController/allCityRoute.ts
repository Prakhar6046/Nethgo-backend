import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFun";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { AdminModel } from "../../models/AdminModel/Admin";

const getAllCityRoutes = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Verify user authentication
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Unauthorized access: User is not authenticated.");
    }

    const adminUserId = req.user._id;
    const adminExists = await AdminModel.exists({ _id: adminUserId });

    // Fetch city routes: filter by adminUserId if user is an admin, otherwise fetch all routes
    const cityRouteFilter = adminExists ? { adminUserId } : {};
    const cityRoutes = await CityRouteModel.find(cityRouteFilter);

    // Send success response with city route data
    return sendSuccessResponse(
      res,
      cityRoutes,
      `City routes retrieved successfully${adminExists ? " for the authenticated admin." : " for all users."}`
    );

  } catch (error) {
    console.error("Error retrieving city route data:", error);
    return sendErrorResponse(
      res,
      500,
      "Server error: Unable to retrieve city route data at this time."
    );
  }
};

export default getAllCityRoutes;
