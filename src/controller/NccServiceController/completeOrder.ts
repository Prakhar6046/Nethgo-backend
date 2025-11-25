import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import {
  CarDriverResponse,
  DriverBusinessInfo,
} from "../../types/carDriverTypeModel";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { OrderDetails } from "../../types/orderTypeModel";
import { DriverBusinessModel } from "../../models/DriverBusinessModel/driverBusiness";
import { CityrouteResponse } from "../../types/CityrouteTypeModel";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";

const CompleteOrder = async (req: Request, res: Response) => {
  try {
    // Check authentication
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. Please log in.");
    }

    const driverId = req.user._id;
    const { orderId } = req.body;

    // Validate input
    if (!orderId) {
      return sendErrorResponse(res, 400, "Order ID is required.");
    }

    // Fetch driver information
    const driverInfo: CarDriverResponse | null = await CarDriversModel.findById(driverId);
    if (!driverInfo) {
      return sendErrorResponse(res, 404, "Driver not found.");
    }

    // Fetch order details
    const orderDetails: OrderDetails | null = await NccBookingModel.findById(orderId);
    if (!orderDetails) {
      return sendErrorResponse(res, 404, "Order not found.");
    }

    // Fetch driver business information
    const businessInfo: DriverBusinessInfo | null = await DriverBusinessModel.findOne({ driverId });

    // Fetch route information
    const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(orderDetails.selectedRouteId);
    // Update the order to mark it as accepted
    await NccBookingModel.updateOne(
      { _id: orderId },
      {
        $set: {
          completeOrder:true,
          carModel:driverInfo?.carModel
        },
      }
    );

    // Update or create driver business info
    if (!businessInfo) {
      const newBusinessInfo = {
        driverId,
        totalProfit: orderDetails.driverCost,
        earningsPerPeriod: orderDetails.driverCost,
        dailyAverage: orderDetails.driverCost,
        totalRuns: 1,
        totalRunsPerDay: 1,
        averageEarningsPerRide: orderDetails.driverCost, 
        timeTravel: routeInfo ? routeInfo.averageTravelTime : orderDetails.averageTravelTime,
      };
      await DriverBusinessModel.create(newBusinessInfo);
    } else {
      const updatedBusinessInfo = {
        totalProfit: businessInfo.totalProfit + orderDetails.driverCost,
        earningsPerPeriod: businessInfo.earningsPerPeriod + orderDetails.driverCost,
        dailyAverage: businessInfo.dailyAverage + orderDetails.driverCost,
        totalRuns: businessInfo.totalRuns + 1,
        totalRunsPerDay: businessInfo.totalRunsPerDay + 1,
        averageEarningsPerRide:
          (businessInfo.dailyAverage + orderDetails.driverCost) /
          (businessInfo.totalRunsPerDay + 1),
        timeTravel: businessInfo.timeTravel +( routeInfo ? routeInfo.averageTravelTime : orderDetails.averageTravelTime),
      };
      await DriverBusinessModel.updateOne(
        { driverId },
        { $set: updatedBusinessInfo }
      );
    }

    // Send success response
    return sendSuccessWithoutResponse(res, "Order successfully completed.");
  } catch (error) {
    console.error("Error accepting order:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while completing the order. Please try again later."
    );
  }
};

export default CompleteOrder;
