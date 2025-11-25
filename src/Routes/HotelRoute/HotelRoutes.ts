import express, { Application } from "express";
import passport from "passport";
import GetAllHotels from "../../controller/HotelController/getAllHotels";
import getSingleHotel from "../../controller/HotelController/getSingleHotel";


const Hotelroutes: Application = express();
Hotelroutes.get("/all-hotels", passport.authenticate("jwt", { session: false }),  GetAllHotels)
Hotelroutes.post("/hotel-info", getSingleHotel)


export default Hotelroutes