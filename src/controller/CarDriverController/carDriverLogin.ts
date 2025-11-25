import { Request, Response } from "express";
import {
  getToken,
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import bcrypt from "bcrypt";
const CarDriverLogin = async (req: Request, res: Response) => {
  try {
    const { driverEmail, driverPassword } = req.body;
    const carDriver = (await CarDriversModel.findOne({
      driverEmail,
    })) as CarDriverResponse | null;
    if (!carDriver) {
      return sendErrorResponse(res, 403, "Invalid email. No account found.");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      driverPassword,
      carDriver.driverPassword
    );
    if (!isPasswordValid) {
      return sendErrorResponse(res, 403, "Invalid password.");
    }
    // Generate JWT token
    const token = await getToken(carDriver.driverEmail, carDriver);
    await CarDriversModel.updateOne(
      { _id: carDriver._id },
      {
        $set: {
          isActive: true,
        },
      }
    );
    // Construct response data without the password
    const CarDriverResponse = {
      _id: carDriver._id,
      email: carDriver.driverEmail,
      fmcToken: carDriver.fmcToken,
      token,
    };
    return sendSuccessResponse(res, CarDriverResponse, "Login successful.");
  } catch (error) {
    sendErrorResponse(res, 500, "Error During Login Car Driver");
  }
};
export default CarDriverLogin;
