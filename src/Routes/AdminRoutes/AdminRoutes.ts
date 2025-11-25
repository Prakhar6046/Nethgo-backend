import express, { Application } from "express";
import registerAdmin, { createSuperAdmin } from "../../controller/AdminController/registerAdmin";
import AllOrderBooking from "../../controller/AdminController/allOrderBooking";
import passport from "passport";
import AllAdminsData from "../../controller/AdminController/allAdmins";
import EditAdmin from "../../controller/AdminController/editAdmin";
import RemoveAdmin from "../../controller/AdminController/removeAdmin";
import createCapoflotta from "../../controller/AdminController/createCapoflotta";
import createDittaIndividuale from "../../controller/AdminController/createDittaIndividuale";
import getCapoflotta from "../../controller/AdminController/getCapoflotta";
import getDittaIndividuale from "../../controller/AdminController/getDittaIndividuale";
import updateCapoflotta from "../../controller/AdminController/updateCapoflotta";
import updateDittaIndividuale from "../../controller/AdminController/updateDittaIndividuale";


const Adminroutes: Application = express();
Adminroutes.post("/register-admin", passport.authenticate("jwt", { session: false }), registerAdmin)
Adminroutes.post("/register-superadmin", createSuperAdmin)
Adminroutes.post("/create-capoflotta", passport.authenticate("jwt", { session: false }), createCapoflotta)
Adminroutes.post("/update-capoflotta", passport.authenticate("jwt", { session: false }), updateCapoflotta)
Adminroutes.post("/create-ditta-individuale", passport.authenticate("jwt", { session: false }), createDittaIndividuale)
Adminroutes.post("/update-ditta-individuale", passport.authenticate("jwt", { session: false }), updateDittaIndividuale)
Adminroutes.get("/all-capoflotta", passport.authenticate("jwt", { session: false }), getCapoflotta)
Adminroutes.get("/all-ditta-individuale", passport.authenticate("jwt", { session: false }), getDittaIndividuale)
Adminroutes.get("/all-order-bookings", passport.authenticate("jwt", { session: false }), AllOrderBooking)
Adminroutes.post("/update-admin", passport.authenticate("jwt", { session: false }), EditAdmin)
Adminroutes.post("/delete-admin", passport.authenticate("jwt", { session: false }), RemoveAdmin)
Adminroutes.get("/all-admin", passport.authenticate("jwt", { session: false }), AllAdminsData)



export default Adminroutes;
