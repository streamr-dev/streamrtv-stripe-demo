import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CardProps {
  emoji: string;
  price: number;
  name: string;
  accountId: string;
  className?: string;
}

function PaymentForm({
  price,
  onSuccess,
}: {
  price: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/purchase/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || "An error occurred");
    } else {
      onSuccess();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement />
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : `Pay $${price.toFixed(2)}`}
      </button>
    </form>
  );
}

export function Card({ emoji, price, name, accountId, className }: CardProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const handleClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/stripe/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          connectedAccountId: accountId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  if (showPayment && clientSecret) {
    return (
      <div
        className={`bg-neutral-800 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/20 ${
          className || ""
        }`}
      >
        <div className="text-6xl mb-4 text-center">{emoji}</div>
        <div className="text-xl font-medium text-center mb-2">{name}</div>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#10B981",
                colorBackground: "#1F2937",
                colorText: "#F9FAFB",
                colorDanger: "#EF4444",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
              },
            },
          }}
        >
          <PaymentForm price={price} onSuccess={() => setShowPayment(false)} />
        </Elements>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer bg-neutral-800 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/20 hover:bg-neutral-700 transition-all ${
        className || ""
      }`}
    >
      <div className="text-6xl mb-4 text-center">{emoji}</div>
      <div className="text-xl font-medium text-center mb-2">{name}</div>
      <div className="text-2xl font-semibold text-center text-green-400">
        Gift ${price.toFixed(2)}
      </div>
    </div>
  );
}
