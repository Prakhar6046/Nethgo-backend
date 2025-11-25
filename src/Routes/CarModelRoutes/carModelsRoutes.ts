import express, { Application } from "express";
import passport from "passport";
import NewCarModel from "../../controller/CarModelController/createModel";
import EditCarModel from "../../controller/CarModelController/updatemodel";
import AllCarModels from "../../controller/CarModelController/getAllModels";
import DeleteCarModel from "../../controller/CarModelController/deleteModel";




const CarModelroutes: Application = express();
CarModelroutes.post("/new-carModel", passport.authenticate("jwt", { session: false }),  NewCarModel)
CarModelroutes.post("/update-carModel", passport.authenticate("jwt", { session: false }),  EditCarModel)
CarModelroutes.get("/all-carModel", passport.authenticate("jwt", { session: false }),  AllCarModels)
CarModelroutes.post("/delete-carModel", passport.authenticate("jwt", { session: false }), DeleteCarModel)



export default CarModelroutes