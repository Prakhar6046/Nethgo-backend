import express, { Application } from "express";
import passport from "passport";
import NewCityRoute from "../../controller/CityRouteController/addCityRoute";
import EditCityRoute from "../../controller/CityRouteController/editCityRoute";
import AllCityRoute from "../../controller/CityRouteController/allCityRoute";
import DeleteCityRoute from "../../controller/CityRouteController/deleteCityRoute";



const CityRouteroutes: Application = express();
CityRouteroutes.post("/new-city-route", passport.authenticate("jwt", { session: false }),  NewCityRoute)
CityRouteroutes.post("/update-city-route", passport.authenticate("jwt", { session: false }),  EditCityRoute)
CityRouteroutes.get("/all-city-route", passport.authenticate("jwt", { session: false }),  AllCityRoute)
CityRouteroutes.post("/delete-city-route", passport.authenticate("jwt", { session: false }),  DeleteCityRoute)



export default CityRouteroutes