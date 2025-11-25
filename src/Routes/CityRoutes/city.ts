import express, { Application } from "express";
import passport from "passport";
import AllCity from "../../controller/AdminController/CityController/allCity";
import AddCity from "../../controller/AdminController/CityController/addcity";
import EditCity from "../../controller/AdminController/CityController/edityCity";
import DeleteCity from "../../controller/AdminController/CityController/deleteCity";
import CitiesWithAdmins from "../../controller/AdminController/CityController/CitiesWithAdmins";



const Cityroutes: Application = express();
Cityroutes.get("/all-city", AllCity)
Cityroutes.get("/all-city-with-admins", CitiesWithAdmins)
Cityroutes.post("/add-city", passport.authenticate("jwt", { session: false }), AddCity)
Cityroutes.post("/edit-city", passport.authenticate("jwt", { session: false }), EditCity)
Cityroutes.post("/delete-city", passport.authenticate("jwt", { session: false }), DeleteCity)

export default Cityroutes;
