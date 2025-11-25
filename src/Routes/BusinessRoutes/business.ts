import express, { Application } from "express";
import GetBusinessInfo from "../../controller/BusinessController/allBusinessInfo";
import passport from "passport";
import GetDriverWeeklyCost from "../../controller/BusinessController/weeklyDriverCost";


const Businessroutes: Application = express();
Businessroutes.get("/business-info", passport.authenticate("jwt", { session: false }), GetBusinessInfo)
Businessroutes.get("/weekly-info", passport.authenticate("jwt", { session: false }), GetDriverWeeklyCost)


export default Businessroutes