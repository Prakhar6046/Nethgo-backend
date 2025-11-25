import express, { Application } from "express";
import passport from "passport";
import Payment from "../../controller/StripePayment/payment";



const Paymentroutes: Application = express();
Paymentroutes.post("/order-payment", passport.authenticate("jwt", { session: false }),  Payment)



export default Paymentroutes