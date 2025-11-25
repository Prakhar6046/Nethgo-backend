import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFun";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

const Payment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return sendErrorResponse(res, 400, "Missing required parameters");
    }

    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency, // Dynamic currency setting
            product_data: {
              name: "Your Product Name",
            },
            unit_amount: amount, // Dynamic amount based on the request
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_BASEURL?.trim()}/payment-success`,
      cancel_url: `${process.env.FRONTEND_BASEURL?.trim()}/payment-failed`,
    });

    // Send session URL to redirect the customer
    return sendSuccessResponse(
      res,
      session.url,
      "Checkout session created successfully"
    );
  } catch (error: unknown) {
    console.error("Error during checkout session creation:", error);
    return sendErrorResponse(res, 500, "Error during payment");
  }
};

export default Payment;
