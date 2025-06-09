import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: Request) {
  try {
    const { amount, connectedAccountId } = await request.json();

    if (!amount || !connectedAccountId) {
      return NextResponse.json(
        { error: "Amount and connected account ID are required" },
        { status: 400 }
      );
    }

    // Create a payment intent with the connected account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      application_fee_amount: Math.round(amount * 0.1 * 100), // 10% platform fee
      transfer_data: {
        destination: connectedAccountId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}
