import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET() {
  try {
    const accounts = await stripe.accounts.list({
      limit: 100,
    });

    // Filter enabled accounts on the server side
    const enabledAccounts = accounts.data.filter(
      (account) => account.charges_enabled
    );

    return NextResponse.json({
      accounts: enabledAccounts.map((account) => ({
        id: account.id,
        name: account.business_profile?.name || "Unnamed Account",
        email: account.email,
        country: account.country,
      })),
    });
  } catch (error) {
    console.error("Error fetching Stripe accounts:", error);
    return NextResponse.json(
      { error: "Error fetching Stripe accounts" },
      { status: 500 }
    );
  }
}
