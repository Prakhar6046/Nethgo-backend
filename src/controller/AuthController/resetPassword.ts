import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { Token } from "../../models/tokenModel/tokenModel";
import { sendErrorResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { userId, token, password } = req.body;
    // Find the password reset token for the specified user
    const passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
        return sendErrorResponse(res,400, "Invalid or expired password reset token.")
      
    }
    // Validate the provided token with the stored hashed token
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        return sendErrorResponse(res,400, "Invalid or expired password reset token.")
      
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the CompanyModel
    await CompanyModel.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    // Delete the password reset token after successful password reset
    await passwordResetToken.deleteOne();
       sendSuccessWithoutResponse(res,"Password reset successfully.")
  } catch (error) {
    console.error("Error resetting password:", error);
    return sendErrorResponse(res,500,"An error occurred while resetting the password.")
  }
};

export default resetPassword;
