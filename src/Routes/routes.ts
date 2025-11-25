import express, { Application } from "express";
import Authroutes from "./AuthRoutes/Auth";
import NccServiceroutes from "./NccServiceRoutes/nccServiceRoutes";
import Adminroutes from "./AdminRoutes/AdminRoutes";
import Hotelroutes from "./HotelRoute/HotelRoutes";
import Paymentroutes from "./PaymentRoutes/paymentRoutes";
import Cityroutes from "./CityRoutes/city";
import Businessroutes from "./BusinessRoutes/business";
import CityRouteroutes from "./CityRouteRoutes/cityRouteRoutes";
import CarDriverroutes from "./CarDriverRoutes/carDriverRoutes";
import CarModelroutes from "./CarModelRoutes/carModelsRoutes";
import AdminSettingRoutes from "./AdminSettingRoutes/AdminSettingRoutes";
import Categoryroutes from "./CategoryRoutes/categoryRoutes";

const route: Application = express();


route.use("/api/auth", Authroutes);
route.use("/api/admin", Adminroutes);
route.use("/api/hotels", Hotelroutes);
route.use("/api/services", NccServiceroutes);
route.use("/api/carDriver", CarDriverroutes);
route.use("/api/carModel", CarModelroutes);
route.use("/api/adminSetting", AdminSettingRoutes);
route.use("/api/cityRoute", CityRouteroutes);
route.use("/api/payment", Paymentroutes);
route.use("/api/city", Cityroutes);
route.use("/api/business", Businessroutes);
route.use("/api/category", Categoryroutes);
export default route;
