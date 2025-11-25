import mongoose from "mongoose";
const CityRouteSchema = new mongoose.Schema({
  adminUserId: {
    type: String,
    require: true,
  },
  from:{
    type: String,
    require: true, 
  },
  to:{
    type: String,
    require: true, 
  },
  averageTravelTime:{
    type: Number,
    require: true, 
  },
  driverCost:{
    type: Number,
    require: true, 
  },
  adminCost:{
    type: Number,
    require: true,
  },
  cooperativeCost:{
    type: Number,
    require: true,
  },
  ditteCost:{
    type: Number,
    require: true,
  },
  totalPrice:{
    type: Number,
    require: true, 
  },
  city:{
    type:String
  },
});

export const CityRouteModel = mongoose.model("routes", CityRouteSchema );
