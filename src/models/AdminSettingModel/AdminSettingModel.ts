import mongoose from "mongoose";

const RoleCostSchema = new mongoose.Schema({
  fixedCost: {
    type: Number,
    required: true,
  },
  costPerKm: {
    type: Number,
    required: true,
  },
});

const VehicleTypeSchema = new mongoose.Schema({
  admin: {
    type: RoleCostSchema,
    required: true,
  },
  cooperative: {
    type: RoleCostSchema,
    required: true,
  },
  driver: {
    type: RoleCostSchema,
    required: true,
  },
  ditta_individuale: {
    type: RoleCostSchema,
    required: true,
  },
});

const MileageBandSchema = new mongoose.Schema({
  kmMin: {
    type: Number,
    required: true,
    default: 0,
  },
  kmMax: {
    type: Number,
    required: true,
  },
  vehicleTypes: {
    berlina: {
      type: VehicleTypeSchema,
      required: true,
    },
    van: {
      type: VehicleTypeSchema,
      required: true,
    },
    lusso: {
      type: VehicleTypeSchema,
      required: true,
    },
  },
});

const AdminSettingSchema = new mongoose.Schema({
  adminUserId: {
    type: String,
    require: true,
  },
  mileageBands: {
    type: [MileageBandSchema],
    required: true,
  },
});

export const AdminSettings = mongoose.model("AdminSetting", AdminSettingSchema);
