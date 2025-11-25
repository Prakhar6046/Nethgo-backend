import express, { Application, Request, Response } from "express";
import route from "./Routes/routes";
import cron from "node-cron";
import connectToDatabase from "./Database/mongoDb";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { CompanyModel } from "./models/CompanyModel/CompanyModel";
import { JwtPayload } from "./types/commonModel";
import { CompanyResponse } from "./types/CompanyModel";
import { AdminResponse } from "./types/AdminTypeModel";
import { AdminModel } from "./models/AdminModel/Admin";
import { refreshBusinessDataDaily, refreshBusinessDataWeekly } from "./middleware/BusinessFunction/refreshBusinessData";
import { CarDriverResponse } from "./types/carDriverTypeModel";
import { CarDriversModel } from "./models/CarDriverModel/CarDriver";
const cors = require("cors");
// instantize an app from express() function
const app: Application = express();
//Add Cors Policies
// Allow all origins in development, or specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? [
        "http://localhost:5173",
        "https://ncc-backend-testing-d2j6.vercel.app",
        "http://localhost:5174",
        "https://ncc-sobm.vercel.app",
        "https://web.nethgo.com"
      ]
    : true, // Allow all origins in development (for mobile apps)
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
express.json({ limit: "50mb" });
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is defined in your environment variables
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
    try {
      const user:CompanyResponse | null = await CompanyModel.findOne({ _id: jwt_payload.identifier });

      let AdminUser:AdminResponse | null = await AdminModel.findOne({ _id: jwt_payload.identifier });
      let DriverUser:CarDriverResponse | null = await CarDriversModel.findOne({ _id: jwt_payload.identifier });

      if (user || AdminUser || DriverUser) {
        
        
        return done(null, user ? user : AdminUser ? AdminUser : DriverUser );
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//MongoDb setup
connectToDatabase();
cron.schedule("0 0 * * *", () => {
  console.log("Running daily business data refresh...");
  refreshBusinessDataDaily();
});
cron.schedule("0 0 * * 0", () => {
    console.log("Running weekly business data refresh...");
    refreshBusinessDataWeekly();
  });
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });
//setup the Port
//All Rout use
app.use(route);

// Use PORT from environment variable (Vercel provides this) or default to 5000 for local development
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Only start listening if not on Vercel (Vercel handles this automatically)
if (!process.env.VERCEL) {
  // For local development, start the server normally
  app.listen(PORT, "0.0.0.0", () => {
    console.log("server has started on port");
    console.log("http://localhost:" + PORT);
    console.log("Server is accessible from network interfaces");
    console.log("For Android emulator, use: http://10.0.2.2:" + PORT);
  });
}

// Export the app for Vercel serverless functions
// Use both ES6 and CommonJS exports for maximum compatibility
export default app;
// Also export as CommonJS for direct require() support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  module.exports.default = app;
}
