import mongoose from "mongoose";
const CarDriversSchema = new mongoose.Schema({
  adminUserId: {
    type: String,
    require: true,
  },
  driverName: {
    type: String,
    require: true,
  },
  cityOfService: {
    type: String,
    require: true,
  },
  carModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarModels",
    required: false,
  },

  category: {
    type: String,
    require: true,
  },
  carType: {
    type: String,
  },
  driverSurname: {
    type: String,
    require: true,
  },
  accessTheApp: {
    type: Boolean,
    require: true,
  },
  driverEmail: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    lowercase: true,
  },
  driverPassword: {
    type: String,
    require: true,
  },
  fmcToken: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

export const CarDriversModel = mongoose.model("CarDrivers", CarDriversSchema);
