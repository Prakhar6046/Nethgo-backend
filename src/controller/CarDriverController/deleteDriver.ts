import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarModels } from "../../models/CarModel/CarModel";
const DeleteDriver = async (req: Request, res: Response) => {
    try {
        const { driverId } = req.body;

        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return sendErrorResponse(res, 401, "User not authenticated");
        }

        // Validate driver ID is provided
        if (!driverId) {
            return sendErrorResponse(res, 400, "Driver ID is required");
        }

        // Check if the driver exists
        const driverInfo = await CarDriversModel.findById(driverId);
        if (!driverInfo) {
            return sendErrorResponse(res, 404, "Driver not found");
        }

        // Remove driver from cars
        await CarModels.updateMany(
            { driverId }, 
            { $set: { driverAssign: false, driverId: null } }
        );

        // Remove the driver
        await CarDriversModel.deleteOne({ _id: driverId });

        return sendSuccessWithoutResponse(res, "Driver removed successfully and car(s) updated");
    } catch (error) {
        console.error("Error removing driver:", error);
        sendErrorResponse(res, 500, "An error occurred while removing the driver");
    }
};

export default DeleteDriver;
