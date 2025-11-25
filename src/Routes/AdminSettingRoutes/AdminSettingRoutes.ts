import express, { Application } from "express";
import passport from "passport";
import UpsertAdminSetting from "../../controller/AdminSettingController/AdminSetting";
import SingleAdminSetting, { getSetting } from "../../controller/AdminSettingController/getAdminSetting";

const AdminSettingRoutes: Application = express();

AdminSettingRoutes.post(
  "/create-update-setting",
  passport.authenticate("jwt", { session: false }),
  UpsertAdminSetting
);
AdminSettingRoutes.get(
  "/get-setting",
  passport.authenticate("jwt", { session: false }),
  SingleAdminSetting
);
AdminSettingRoutes.get("/get",   passport.authenticate("jwt", { session: false }),getSetting) 
export default AdminSettingRoutes;
