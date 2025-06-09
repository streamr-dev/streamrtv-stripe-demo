"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Balance {
  amount: number;
  currency: string;
}

interface DashboardData {
  balance: {
    available: Balance[];
    pending: Balance[];
  };
  dashboardUrl: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the account ID from localStorage (set during onboarding)
        const accountId = localStorage.getItem("stripeAccountId");

        if (!accountId) {
          throw new Error(
            "No account ID found. Please complete onboarding first."
          );
        }

        const response = await fetch(
          `/api/stripe/dashboard?accountId=${accountId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch dashboard data");
        }

        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href="/onboarding"
            className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Complete Onboarding
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Your Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Available Balance
              </h2>
              {data.balance.available.map((balance, index) => (
                <div key={index} className="text-2xl font-bold text-green-400">
                  {balance.amount.toFixed(2)} {balance.currency.toUpperCase()}
                </div>
              ))}
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Pending Balance
              </h2>
              {data.balance.pending.map((balance, index) => (
                <div key={index} className="text-2xl font-bold text-yellow-400">
                  {balance.amount.toFixed(2)} {balance.currency.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <a
              href={data.dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Open Stripe Dashboard
            </a>
            <Link
              href="/"
              className="block w-full text-center py-3 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
