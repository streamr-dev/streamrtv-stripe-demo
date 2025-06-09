import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: Request) {
  try {
    const { email, name, country } = await request.json();

    if (!email || !name || !country) {
      return NextResponse.json(
        { error: "Email, name, and country are required" },
        { status: 400 }
      );
    }

    // Create a Stripe Express account
    const account = await stripe.accounts.create({
      type: "express",
      email,
      business_type: "individual",
      country,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name,
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
    });

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success?accountId=${account.id}`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      accountId: account.id,
      url: accountLink.url,
    });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return NextResponse.json(
      { error: "Error creating Stripe account" },
      { status: 500 }
    );
  }
}
