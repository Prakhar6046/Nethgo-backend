import { Request, Response } from "express";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { Token } from "../../models/tokenModel/tokenModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import ResetPasswordEmail from "../../middleware/email/forgotPasswordEmail";
import { CompanyResponse } from "../../types/CompanyModel";
dotenv.config();

const ForgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user:CompanyResponse |null = await CompanyModel.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, "User not found please enter valid email.")
    }

    // Remove any existing token for the user
    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    // Generate a new reset token and hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    // Save the new token with a timestamp for expiration management
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    // Create a reset link and send it in the response (in production, you would email this link)
    const resetLink = `${process.env.FRONTEND_BASEURL}/reset-password/${user._id}/${resetToken}`;
    await ResetPasswordEmail(user, resetLink,res)
    return sendSuccessWithoutResponse(res,"Reset Password Mail Sent to Your Email")
  } catch (error) {
    console.error("Error during password reset:", error);
    return sendErrorResponse(res, 500, "An error occurred while processing the password reset request.")
  }
};

export default ForgotPassword;
