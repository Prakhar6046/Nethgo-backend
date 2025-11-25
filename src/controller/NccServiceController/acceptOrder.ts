import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import {
  CarDriverResponse,
} from "../../types/carDriverTypeModel";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { OrderDetails } from "../../types/orderTypeModel";
import { CityrouteResponse } from "../../types/CityrouteTypeModel";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { CompanyResponse } from "../../types/CompanyModel";
import SendDriverAcceptanceEmailToHotel from "../../middleware/email/acceptDriverEmail";

const AcceptOrder = async (req: Request, res: Response) => {
  try {
    // Check authentication
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "Authentication failed. Please log in.");
    }

    const driverId = req.user._id;
    const { orderId, pin } = req.body;

    // Validate input
    if (!orderId) {
      return sendErrorResponse(res, 400, "Order ID is required.");
    }

    if (!pin) {
      return sendErrorResponse(res, 400, "PIN is required to accept the order.");
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

    // Check if the order is already accepted
    if (orderDetails.driverAccept) {
      return sendErrorResponse(res, 409, "Order already accepted by another driver.");
    }

    // Verify PIN before accepting order
    if (!orderDetails.securityPin || orderDetails.securityPin !== pin) {
      return sendErrorResponse(res, 401, "Invalid PIN. Please check the PIN sent to the customer's email and try again.");
    }

    // Fetch company  information
    const companyInfo: CompanyResponse | null = await CompanyModel.findOne({_id: orderDetails.companyId});
      if(!companyInfo){
         return sendErrorResponse(res, 409, "Client Info does not Found");
      }
    // Fetch route information
    // const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(orderDetails.selectedRouteId);
    // Update the order to mark it as accepted and PIN verified
    await NccBookingModel.updateOne(
      { _id: orderId },
      {
        $set: {
          driverAccept: true,
          driverId,
          driverName: `${driverInfo.driverName} ${driverInfo.driverSurname}`,
          driveAcceptDate: Date.now(),
          pinVerified: true,
        },
      }
    );

    // // Update or create driver business info
    // if (!businessInfo) {
    //   const newBusinessInfo = {
    //     driverId,
    //     totalProfit: orderDetails.totalPrice,
    //     earningsPerPeriod: orderDetails.totalPrice,
    //     dailyAverage: orderDetails.totalPrice,
    //     totalRuns: 1,
    //     totalRunsPerDay: 1,
    //     averageEarningsPerRide: orderDetails.totalPrice, 
    //     timeTravel: routeInfo.averageTravelTime,
    //   };
    //   await DriverBusinessModel.create(newBusinessInfo);
    // } else {
    //   const updatedBusinessInfo = {
    //     totalProfit: businessInfo.totalProfit + orderDetails.totalPrice,
    //     earningsPerPeriod: businessInfo.earningsPerPeriod + orderDetails.totalPrice,
    //     dailyAverage: businessInfo.dailyAverage + orderDetails.totalPrice,
    //     totalRuns: businessInfo.totalRuns + 1,
    //     totalRunsPerDay: businessInfo.totalRunsPerDay + 1,
    //     averageEarningsPerRide:
    //       (businessInfo.dailyAverage + orderDetails.totalPrice) /
    //       (businessInfo.totalRunsPerDay + 1),
    //     timeTravel: businessInfo.timeTravel + routeInfo.averageTravelTime,
    //   };
    //   await DriverBusinessModel.updateOne(
    //     { driverId },
    //     { $set: updatedBusinessInfo }
    //   );
    // }

    // Send success response
    await SendDriverAcceptanceEmailToHotel(companyInfo?.email, driverInfo, res)
    return sendSuccessWithoutResponse(res, "Order successfully accepted.");
  } catch (error) {
    console.error("Error accepting order:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while accepting the order. Please try again later."
    );
  }
};

export default AcceptOrder;
