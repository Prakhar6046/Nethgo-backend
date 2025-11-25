import mongoose from "mongoose";
const CitySchema = new mongoose.Schema({
  cityName:{
    type:String
  },
  cityUsed:{
    type:Boolean,
    default:false
  }
});

export const CityModel = mongoose.model("Citys", CitySchema);

