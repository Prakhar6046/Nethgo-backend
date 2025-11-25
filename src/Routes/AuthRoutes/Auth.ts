import express, { Application } from "express";
import registerCompany from "../../controller/AuthController/registerCompany";
import loginCompany from "../../controller/AuthController/loginCompany";
import passport from "passport";
import UpdateCompanyProfile from "../../controller/AuthController/updateCompanyProfile";
import GetCompanyProfile from "../../controller/AuthController/getCompanyProfile";
import ForgotPassword from "../../controller/AuthController/forgotPassword";
import resetPassword from "../../controller/AuthController/resetPassword";
import deleteCompanyInfo from "../../controller/AuthController/deleteCompany";

const Authroutes: Application = express();
Authroutes.post("/register-company", registerCompany)
Authroutes.post("/login-company", loginCompany)
Authroutes.post("/reset-password", resetPassword)
Authroutes.post("/forgot-password", ForgotPassword)
Authroutes.post("/update-company", passport.authenticate("jwt", { session: false }), UpdateCompanyProfile)
Authroutes.get("/get-company", passport.authenticate("jwt", { session: false }), GetCompanyProfile)
Authroutes.post("/delete-company", passport.authenticate("jwt", { session: false }), deleteCompanyInfo)

export default Authroutes;
