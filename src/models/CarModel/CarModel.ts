import mongoose from "mongoose";
const CarModelSchema = new mongoose.Schema({
  adminUserId: {
    type: String,
    require: true,
  },
  carType: {
    type: Number,
    require: true,
  },
  targa: {
    type: String,
    require: true,
  },
  module: {
    type: String,
    require: true,
  },
  cityOfService: {
    type: String,
    require: true,
  },
  licenseNumber: {
    type: String,
    require: true,
  },
  driverAssign: {
    type: Boolean,
    default: false,
  },
  driverId: {
    type: String,
  },
});

export const CarModels = mongoose.model("CarModels", CarModelSchema);
