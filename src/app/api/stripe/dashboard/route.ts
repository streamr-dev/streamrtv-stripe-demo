import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Get the account's balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    // Create a login link for the dashboard
    const loginLink = await stripe.accounts.createLoginLink(accountId);

    return NextResponse.json({
      balance: {
        available: balance.available.map((b) => ({
          amount: b.amount / 100, // Convert from cents to dollars
          currency: b.currency,
        })),
        pending: balance.pending.map((b) => ({
          amount: b.amount / 100,
          currency: b.currency,
        })),
      },
      dashboardUrl: loginLink.url,
    });
  } catch (error) {
    console.error("Error fetching Stripe dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching Stripe dashboard data" },
      { status: 500 }
    );
  }
}
