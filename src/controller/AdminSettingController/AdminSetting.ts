import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { AdminSettings } from "../../models/AdminSettingModel/AdminSettingModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const UpsertAdminSetting = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { mileageBands } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated");
    }

    // Validate mileageBands structure
    if (!mileageBands || !Array.isArray(mileageBands) || mileageBands.length === 0) {
      return sendErrorResponse(res, 400, "At least one mileage band is required.");
    }

    // Validate each mileage band
    for (const band of mileageBands) {
      if (typeof band.kmMin !== "number" || band.kmMin < 0) {
        return sendErrorResponse(res, 400, "Each mileage band must have a valid kmMin value (>= 0).");
      }
      if (!band.kmMax || typeof band.kmMax !== "number") {
        return sendErrorResponse(res, 400, "Each mileage band must have a valid kmMax value.");
      }
      if (band.kmMin >= band.kmMax) {
        return sendErrorResponse(res, 400, "kmMin must be less than kmMax for each mileage band.");
      }
      if (!band.vehicleTypes) {
        return sendErrorResponse(res, 400, "Each mileage band must have vehicleTypes.");
      }
      
      const vehicleTypes = ["berlina", "van", "lusso"];
      const roles = ["admin", "cooperative", "driver", "ditta_individuale"];
      
      for (const vehicleType of vehicleTypes) {
        if (!band.vehicleTypes[vehicleType]) {
          return sendErrorResponse(res, 400, `Each mileage band must have ${vehicleType} vehicle type.`);
        }
        for (const role of roles) {
          if (!band.vehicleTypes[vehicleType][role]) {
            return sendErrorResponse(res, 400, `Each vehicle type must have ${role} role costs.`);
          }
          if (typeof band.vehicleTypes[vehicleType][role].fixedCost !== "number" ||
              typeof band.vehicleTypes[vehicleType][role].costPerKm !== "number") {
            return sendErrorResponse(res, 400, `Invalid cost values for ${vehicleType} - ${role}.`);
          }
        }
      }
    }

    const adminUserId = req.user._id.toString();

    // Prepare the settings data
    const settingsData = {
      adminUserId,
      mileageBands,
    };

    // Check if settings already exist
    const existingSettings = await AdminSettings.findOne({ adminUserId });

    if (existingSettings) {
      // Update existing settings
      await AdminSettings.updateOne({ adminUserId }, settingsData);
      return sendSuccessWithoutResponse(res, "Admin settings updated successfully.");
    } else {
      // Create new settings
      await AdminSettings.create(settingsData);
      return sendSuccessWithoutResponse(res, "Admin settings created successfully.");
    }

  } catch (error) {
    console.error("Error in Admin Settings upsert:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while processing admin settings."
    );
  }
};

export default UpsertAdminSetting;
