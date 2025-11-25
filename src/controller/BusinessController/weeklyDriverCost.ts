import { Request, Response } from "express";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CarModels } from "../../models/CarModel/CarModel";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { AdminResponse } from "../../types/AdminTypeModel";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const GetDriverWeeklyCost = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, "User not authenticated.");
    }
    
    const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());

    // Check if admin exists
    const adminExists: AdminResponse | null = await AdminModel.findById(effectiveAdminUserId);
    if (!adminExists) {
      return sendErrorResponse(res, 404, "Admin not found");
    }
    const { start, end } = req.query;
    if (!start || !end) {
      return sendErrorResponse(res, 400, "Start and end dates are required");
    }

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    // Fetch all completed bookings in date range using effective admin's city
    const bookings = await NccBookingModel.find({
      city: adminInfo.cityId,
      completeOrder: true,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const allDrivers = await CarDriversModel.find({ adminUserId: effectiveAdminUserId });

    const driverCategoryMap: Record<string, string> = {};
    for (const driver of allDrivers) {
      driverCategoryMap[String(driver._id)] = driver.category || "Unknown";
    }

    // Aggregate costs by category
    const categoryMap: Record<
      string,
      { total: number; drivers: Record<string, number> }
    > = {};

    for (const booking of bookings) {
      const driverId = booking.driverId || "Unknown";
      const driverName = booking.driverName || driverId || "Unknown Driver";
      const category = driverCategoryMap[driverId] || "Unknown";
      const cost = booking.driverCost ?? 0;

      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, drivers: {} };
      }
      categoryMap[category].total += cost;
      if (!categoryMap[category].drivers[driverName]) {
        categoryMap[category].drivers[driverName] = 0;
      }
      categoryMap[category].drivers[driverName] += cost;
    }

    // Fetch all cars registered under this admin

    // for (const car of allCars) {
    //   const bookingsForCar = bookings.filter(
    //     (b) => b.carModel === String(car._id)
    //   );
    //   // Use driverId as key, store { name, cost }
    //   const driverMap: Record<string, { name: string; cost: number }> = {};

    //   for (const booking of bookingsForCar) {
    //     const driverId = booking.driverId || "Unknown";
    //     const driverName = booking.driverName || driverId || "Unknown Driver";
    //     if (!driverMap[driverId])
    //       driverMap[driverId] = { name: driverName, cost: 0 };
    //     driverMap[driverId].cost += booking.driverCost ?? 0;
    //     console.log({
    //       driverId,
    //       driverName,
    //       mappedCategory: driverCategoryMap[driverId],
    //     });
    //   }

    //   const totalCost = Object.values(driverMap).reduce(
    //     (sum, val) => sum + val.cost,
    //     0
    //   );

    //   carMap.set(car && car.module && car.module.toUpperCase(), {
    //     totalCost,
    //     drivers: Object.entries(driverMap).map(([driverId, info]) => ({
    //       name: info.name,
    //       cost: info.cost,
    //       category: driverCategoryMap[driverId] || "Unknown",
    //     })),
    //   });
    // }

    // for (const car of allCars) {
    //   const bookingsForCar = bookings.filter(
    //     (b) => b.carModel === String(car._id)
    //   );
    //   const driverMap: Record<string, number> = {};

    //   for (const booking of bookingsForCar) {
    //     const driverName =
    //       booking.driverName || booking.driverId || "Unknown Driver";
    //     if (!driverMap[driverName]) driverMap[driverName] = 0;
    //     driverMap[driverName] += booking.driverCost ?? 0;
    //   }

    //   const totalCost = Object.values(driverMap).reduce(
    //     (sum, val) => sum + val,
    //     0
    //   );

    //   carMap.set(car && car.module && car.module.toUpperCase(), {
    //     totalCost,
    //     drivers: Object.entries(driverMap).map(([name, cost, category]) => ({
    //       name,
    //       cost,
    //       category:
    //         allDrivers.find((d) => d.driverName === name)?.category ||
    //         "Unknown",
    //     })),
    //   });
    // }

    const result = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      drivers: Object.entries(data.drivers).map(([name, total]) => ({
        name,
        total,
      })),
    }));

    return sendSuccessResponse(res, result, "Weekly driver cost fetched");
  } catch (error) {
    console.error("Error in GetDriverWeeklyCost:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
export default GetDriverWeeklyCost;
