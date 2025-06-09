import Link from "next/link";

export default function PurchaseSuccess() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Purchase Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Thank you for your support!
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Link
              href="/purchase"
              className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
