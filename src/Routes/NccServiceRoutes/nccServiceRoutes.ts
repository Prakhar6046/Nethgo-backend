import express, { Application } from "express";
import passport from "passport";
import RequestService from "../../controller/NccServiceController/RequestNccService";
import GetAllServices from "../../controller/NccServiceController/GetAllServices";
import GetCityRequestService from "../../controller/NccServiceController/getCityRequestService";
import GetSingleOrderService from "../../controller/NccServiceController/singleOrder";
import GetAllDriverAcceptedOrder from "../../controller/NccServiceController/getDriverAcceptedOrders";
import GetSingleAcceptedOrder from "../../controller/NccServiceController/getSingleAcceptedOrder";
import AcceptOrder from "../../controller/NccServiceController/acceptOrder";
import RejectOrder from "../../controller/NccServiceController/rejectOrder";
import CompleteOrder from "../../controller/NccServiceController/completeOrder";

const NccServiceroutes: Application = express();
NccServiceroutes.post("/request-service", passport.authenticate("jwt", { session: false }),  RequestService)
NccServiceroutes.post("/accept-order", passport.authenticate("jwt", { session: false }),  AcceptOrder)
NccServiceroutes.post("/complete-order", passport.authenticate("jwt", { session: false }),  CompleteOrder)
NccServiceroutes.get("/all-services", passport.authenticate("jwt", { session: false }),  GetAllServices)
NccServiceroutes.get("/all-city-services", passport.authenticate("jwt", { session: false }),  GetCityRequestService)
NccServiceroutes.get("/single-order/:orderId", passport.authenticate("jwt", { session: false }),  GetSingleOrderService)
NccServiceroutes.get("/accepted-order", passport.authenticate("jwt", { session: false }),  GetAllDriverAcceptedOrder)
NccServiceroutes.get("/accept-single-order/:acceptedOrderId", passport.authenticate("jwt", { session: false }),  GetSingleAcceptedOrder)
NccServiceroutes.post("/reject-order", passport.authenticate("jwt", { session: false }), RejectOrder)


export default NccServiceroutes