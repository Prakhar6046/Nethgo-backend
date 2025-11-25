import mongoose from "mongoose";
const NccBookingSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    require: true,
  },
  cityOrderNumber: {
    type: Number,
    require: true,
  },
  hotelOrderNumber: {
    type: Number,
    require: true,
  },
  companyId: {
    type: String,
    require: true,
  },
  selectedRouteId: {
    type: String,
    require: true,
  },
  isReverse: {
    type: Boolean,
    default: false,
  },
  from: {
    type: String,
    require: true,
  },
  fromLat: {
    type: Number,
  },
  fromLong: {
    type: Number,
  },
  fromDescription: {
    type: String,
  },
  to: {
    type: String,
    require: true,
  },
  toLat: {
    type: Number,
  },
  toLong: {
    type: Number,
  },
  toDescription: {
    type: String,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  driverCost: {
    type: Number,
    require: true,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  driverId: {
    type: String,
  },
  driverName: {
    type: String,
  },
  driverAccept: {
    type: Boolean,
    default: false,
  },
  driveAcceptDate: {
    type: Date,
  },
  preferVehicel: {
    type: Number,
    require: true,
  },
  clientName: {
    type: String,
    require: true,
  },
  telePhone: {
    type: Number,
    require: true,
  },
  customerEmail: {
    type: String,
    require: true,
  },
  securityPin: {
    type: String,
    require: false,
  },
  pinVerified: {
    type: Boolean,
    default: false,
  },
  noOfPassengers: {
    type: Number,
    require: true,
  },
  appointmentTime: {
    type: String,
    require: true,
  },
  appointmentDate: {
    type: String,
    require: true,
  },
  usefulInformation: {
    type: String,
  },
  completeOrder: {
    type: Boolean,
    require: false,
    default: false,
  },
  carModel: {
    type: String,
  },
  averageTravelTime: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const NccBookingModel = mongoose.model("bookings", NccBookingSchema);
