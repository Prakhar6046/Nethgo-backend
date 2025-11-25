import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import { CarModels } from "../../models/CarModel/CarModel";
import { CityModel } from "../../models/CityModel/CityModel";

export const IndividualCarDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { CarDriverId } = req.body;
    // Fetch all car drivers for the authenticated user
    const CarDriversInfo: CarDriverResponse | null =
      await CarDriversModel.findOne({ _id: CarDriverId });
    if (!CarDriversInfo) {
      return sendErrorResponse(
        res,
        403,
        "Car Driver Not Found Please chack the detail"
      );
    }
    let CarModelInfo = null;
    if (CarDriversInfo.carModel) {
      CarModelInfo = await CarModels.findById(CarDriversInfo.carModel);
    }
    
    const CarDriverResponse = {
      driverName: CarDriversInfo.driverName,
      driverSurname: CarDriversInfo.driverSurname,
      cityOfService: CarDriversInfo.cityOfService,
      carType: CarModelInfo?.carType ?? null,
      targa: CarModelInfo?.targa ?? "",
      module: CarModelInfo?.module ?? "",
      licenseNumber: CarModelInfo?.licenseNumber ?? "",
    };
    // Send response with fetched data
    return sendSuccessResponse(
      res,
      CarDriverResponse,
      "All Car Driver Info retrieved successfully."
    );
  } catch (error) {
    console.error("Error while getting all car driver data:", error);
    return sendErrorResponse(
      res,
      500,
      "Error while getting all car driver data."
    );
  }
};
export const IndividualAppCarDriver = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }

    const CarDriverId = req.user._id;
    const CarDriversInfo: CarDriverResponse | null =
      await CarDriversModel.findOne({ _id: CarDriverId });
    if (!CarDriversInfo) {
      return sendErrorResponse(
        res,
        403,
        "Car Driver Not Found Please chack the detail"
      );
    }
    let CarModelInfo;
    if (CarDriversInfo.carModel) {
      CarModelInfo = await CarModels.findById(CarDriversInfo.carModel);
    }
     let cityName = "";
    if (CarDriversInfo.cityOfService) {
      const cityDoc = await CityModel.findById(CarDriversInfo.cityOfService);
      cityName = cityDoc?.cityName || "";
    }

    const CarDriverResponse = {
      _id: CarDriverId,
      email: CarDriversInfo.driverEmail,
      carModel: CarDriversInfo.carModel,
      driverName: CarDriversInfo.driverName,
      driverSurname: CarDriversInfo.driverSurname,
      cityOfService: cityName, 
      carType: CarModelInfo?.carType ?? null,
      targa: CarModelInfo?.targa ?? "",
      module: CarModelInfo?.module ?? "",
      licenseNumber: CarModelInfo?.licenseNumber ?? "",
    };
    // Send response with fetched data
    return sendSuccessResponse(
      res,
      CarDriverResponse,
      "All Car Driver Info retrieved successfully."
    );
  } catch (error) {
    console.error("Error while getting all car driver data:", error);
    return sendErrorResponse(
      res,
      500,
      "Error while getting all car driver data."
    );
  }
};
