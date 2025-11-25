import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";

const DeleteCityRoute = async (req: Request, res: Response) => {
    try {
        const { cityRouteId } = req.body;

        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return sendErrorResponse(res, 401, "User not authenticated");
        }

        // Validate City Route ID is provided
        if (!cityRouteId) {
            return sendErrorResponse(res, 400, "City Route ID is required");
        }

        // Check if the City Route exists
        const cityRouteInfo = await CityRouteModel.findById(cityRouteId);
        if (!cityRouteInfo) {
            return sendErrorResponse(res, 404, "City Route not found");
        }

        // Remove the City Route
        await CityRouteModel.deleteOne({ _id: cityRouteId });
        return sendSuccessWithoutResponse(res, "City Route removed successfully");
    } catch (error) {
        console.error("Error removing City Route:", error);
        sendErrorResponse(res, 500, "An error occurred while removing the City Route");
    }
};

export default DeleteCityRoute;
