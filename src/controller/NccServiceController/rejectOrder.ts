import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { OrderDetails } from "../../types/orderTypeModel";
import { CityrouteResponse } from "../../types/CityrouteTypeModel";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { firebaseAdmin } from "../../middleware/firebase/firebase";
import SendDriverRejectionEmailToHotel from "../../middleware/email/rejectDriverEmail";
import { CompanyResponse } from "../../types/CompanyModel";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";

const RejectOrder = async (req: Request, res: Response) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return sendErrorResponse(
        res,
        401,
        "Authentication failed. Please log in."
      );
    }
    const driverId = req.user._id;
    const { orderId } = req.body;

    // Input validation
    if (!orderId) {
      return sendErrorResponse(res, 400, "Order ID is required.");
    }

    // Fetch driver information
    const driverInfo: CarDriverResponse | null = await CarDriversModel.findById(
      driverId
    );
    if (!driverInfo) {
      return sendErrorResponse(res, 404, "Driver not found.");
    }

    // Fetch order details
    const orderDetails: OrderDetails | null = await NccBookingModel.findById(
      orderId
    );
    if (!orderDetails) {
      return sendErrorResponse(res, 404, "Order not found.");
    }

    // // Fetch route information
    // const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(
    //   orderDetails.selectedRouteId
    // );
    // Fetch company  information
    const companyInfo: CompanyResponse | null = await CompanyModel.findOne({
      _id: orderDetails?.companyId,
    });
    if (!companyInfo) {
      return sendErrorResponse(res, 409, "Client Info does not Found");
    }
    // Reject the order by updating the database
    await NccBookingModel.updateOne(
      { _id: orderId },
      {
        $set: {
          driverAccept: false,
          driverId: "",
          driverName: "",
          driveAcceptDate: null,
        },
      }
    );

    // // Fetch driver business info
    // const businessInfo: DriverBusinessInfo | null =
    //   await DriverBusinessModel.findOne({ driverId });
    // if (!businessInfo) {
    //   return sendErrorResponse(res, 404, "Driver business info not found.");
    // }

    // // Update existing business info
    // const updatedBusinessInfo = {
    //   totalProfit: businessInfo.totalProfit - orderDetails.totalPrice,
    //   earningsPerPeriod:
    //     businessInfo.earningsPerPeriod - orderDetails.totalPrice,
    //   dailyAverage: Math.max(
    //     0,
    //     businessInfo.dailyAverage - orderDetails.totalPrice
    //   ),
    //   totalRuns: Math.max(0, businessInfo.totalRuns - 1),
    //   totalRunsPerDay: Math.max(0, businessInfo.totalRunsPerDay - 1),
    //   averageEarningsPerRide:
    //     businessInfo.totalRunsPerDay > 1
    //       ? (businessInfo.dailyAverage - orderDetails.totalPrice) /
    //       (businessInfo.totalRunsPerDay - 1)
    //       : 0,
    //   timeTravel: Math.max(
    //     0,
    //     businessInfo.timeTravel - routeInfo.averageTravelTime
    //   ),
    // };
    // await DriverBusinessModel.updateOne(
    //   { driverId },
    //   { $set: updatedBusinessInfo }
    // );
    const drivers = await CarDriversModel.find({
      cityOfService: driverInfo.cityOfService,
      isActive: true,
    });
    if (!drivers || drivers.length === 0) {
      console.warn("No active drivers found in the city.");
    } else {
      // Map to extract FCM tokens
      const fcmTokens = drivers
        .map((driver) => driver.fmcToken)
        .filter((token): token is string => Boolean(token)); // Ensure non-null, non-undefined values

      if (fcmTokens.length > 0) {
        const notificationPayload = {
          notification: {
            title: "Nuova corsa da Neth",
            body: `Hai una corsa in attesa. Visualizza le informazioni e accetta la richiesta.`,
          },
          data: {
            bookingId: orderDetails._id.toString(),
            orderNumber: orderDetails.orderNumber.toString(),
            city: orderDetails.city,
          },
        };

        // Use sendMulticast for multiple tokens
        const response = await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: fcmTokens,
          ...notificationPayload,
        });

        console.log(
          `Notifications sent successfully: ${response.successCount} successful, ${response.failureCount} failed.`
        );

        if (response.failureCount > 0) {
          console.warn(
            "Failed to send notifications to some devices:",
            response.responses
              .filter((r: any) => !r.success)
              .map((r: any) => r.error)
          );
        }
      } else {
        console.warn("No FCM tokens found for drivers in the city.");
      }
    }
    // Send success response
    await SendDriverRejectionEmailToHotel(companyInfo.email, res);
    return sendSuccessWithoutResponse(res, "Order successfully rejected.");
  } catch (error) {
    console.error("Error rejecting order:", error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while rejecting the order. Please try again later."
    );
  }
};

export default RejectOrder;
