import { Response } from "express";

import jwt from "jsonwebtoken";
import { CompanyResponse } from "../types/CompanyModel";
import { AdminResponse } from "../types/AdminTypeModel";
import { CarDriverResponse } from "../types/carDriverTypeModel";
import translateToItalian from "./translateService";
require("dotenv").config();
export const sendErrorResponse = async (
  res: Response,
  statusCode: number,
  message: string
) => {
  const translatedMessage = await translateToItalian(message);
    return res.status(statusCode).json({
      status: false,
      message:translatedMessage,
    });
};
export const sendSuccessResponse = async(
  res: Response,
  data: any,
  message: string
) => {
  const translatedMessage = await translateToItalian(message);
  return res.status(200).json({
    status: true,
    data: data,
    message:translatedMessage,
  });
};
export const sendSuccessWithoutResponse = async(res: Response, message: string) => {
  const translatedMessage = await translateToItalian(message);
  return res.status(200).json({
    status: true,
    message:translatedMessage,
  });
};

export const getToken = async (
  email: string,
  user: CompanyResponse | AdminResponse | CarDriverResponse
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign({ identifier: user._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
  return token;
};
