import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarModels } from "../../models/CarModel/CarModel";

const DeleteCarModel = async (req: Request, res: Response) => {
    try {
        const { carModelId } = req.body;

        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return sendErrorResponse(res, 401, "User not authenticated");
        }

        // Validate Model ID is provided
        if (!carModelId) {
            return sendErrorResponse(res, 400, "Car Model ID is required");
        }

        // Check if the Model exists
        const carModelInfo = await CarModels.findById(carModelId);
        if (!carModelInfo) {
            return sendErrorResponse(res, 404, "Car Model not found");
        }

        // Remove the Model
        await CarModels.deleteOne({ _id: carModelId });
        return sendSuccessWithoutResponse(res, "Car Model removed successfully");
    } catch (error) {
        console.error("Error removing Model:", error);
        sendErrorResponse(res, 500, "An error occurred while removing the Model");
    }
};

export default DeleteCarModel;
