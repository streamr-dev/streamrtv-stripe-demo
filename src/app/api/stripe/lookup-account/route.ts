import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // List accounts and filter by email
    const accounts = await stripe.accounts.list({
      limit: 100,
    });

    // Find the account with matching email
    const account = accounts.data.find((acc) => acc.email === email);

    if (!account) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Check if the account is enabled
    if (!account.charges_enabled) {
      return NextResponse.json(
        { error: "Account is not fully set up. Please complete onboarding." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      accountId: account.id,
      name: account.business_profile?.name || "Unnamed Account",
    });
  } catch (error) {
    console.error("Error looking up Stripe account:", error);
    return NextResponse.json(
      { error: "Error looking up Stripe account" },
      { status: 500 }
    );
  }
}
