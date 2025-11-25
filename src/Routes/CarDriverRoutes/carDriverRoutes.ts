import express, { Application } from "express";
import passport from "passport";
import NewCarDriver from "../../controller/CarDriverController/carDriver";
import EditCarDriver from "../../controller/CarDriverController/editCarDriver";
import AllCarDriver from "../../controller/CarDriverController/allCarDriver";
import DeleteDriver from "../../controller/CarDriverController/deleteDriver";
import CarDriverLogin from "../../controller/CarDriverController/carDriverLogin";
import getDriverBusiness from "../../controller/CarDriverController/getDriverBusinessModel";
import AddDriverFmcToken from "../../controller/CarDriverController/addDriverfmcToken";
import CarDriverLogOut from "../../controller/CarDriverController/carDriverLogout";
import SelectDriverModel from "../../controller/CarDriverController/selectDriverModel";
import UnSelectDriverModel from "../../controller/CarDriverController/unSelectDriverModel";
import AllAppCarModels from "../../controller/CarModelController/getAllModelForApp";
import { IndividualAppCarDriver, IndividualCarDriver } from "../../controller/CarDriverController/individualCarDriver";



const CarDriverroutes: Application = express();
CarDriverroutes.post("/new-carDriver", passport.authenticate("jwt", { session: false }),  NewCarDriver)
CarDriverroutes.post("/update-carDriver", passport.authenticate("jwt", { session: false }),  EditCarDriver)
CarDriverroutes.get("/all-carDriver", passport.authenticate("jwt", { session: false }),  AllCarDriver)
CarDriverroutes.post("/carDriver-info", IndividualCarDriver)
CarDriverroutes.get("/app-driver-info", passport.authenticate("jwt", { session: false }),  IndividualAppCarDriver)
CarDriverroutes.post("/delete-carDriver", passport.authenticate("jwt", { session: false }), DeleteDriver)
CarDriverroutes.get("/all-car-model", passport.authenticate("jwt", { session: false }), AllAppCarModels)
CarDriverroutes.get("/business", passport.authenticate("jwt", { session: false }), getDriverBusiness)
CarDriverroutes.post("/add-fmctoken", passport.authenticate("jwt", { session: false }), AddDriverFmcToken)
CarDriverroutes.post("/logout-driver", passport.authenticate("jwt", { session: false }), CarDriverLogOut)
CarDriverroutes.post("/select-Model", passport.authenticate("jwt", { session: false }), SelectDriverModel)
CarDriverroutes.post("/unSelect-Model", passport.authenticate("jwt", { session: false }), UnSelectDriverModel)
CarDriverroutes.post("/login-driver",  CarDriverLogin)


export default CarDriverroutes