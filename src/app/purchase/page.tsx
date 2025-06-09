"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "./components/Card";

interface Account {
  id: string;
  name: string;
  email: string;
  country: string;
}

export default function PurchasePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/stripe/accounts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch accounts");
        }

        setAccounts(data.accounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-[1400px] w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Support your favorite Streamers
          </h1>
          <p className="text-gray-400 mb-8">Choose a creator to support</p>
        </div>

        {loading && (
          <p className="text-gray-400 text-center">Loading streamers...</p>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card
              key={account.id}
              emoji="🎬"
              price={9.99}
              name={account.name}
              accountId={account.id}
              className="w-full"
            />
          ))}
        </div>

        <div className="max-w-md mx-auto w-full">
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
