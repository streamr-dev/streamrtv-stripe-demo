import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to StreamrTV
          </h1>
          <p className="text-gray-400 mb-8">
            Start your streaming journey today
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/onboarding"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Creator? Get Started
          </Link>
          <Link
            href="/purchase"
            className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Support Streamer
          </Link>
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Access Dashboard
          </Link>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">
            How it works
          </h2>
          <div className="space-y-4">
            <Image
              src="/flowchart.svg"
              alt="StreamrTV Flowchart"
              width={400}
              height={300}
              className="rounded-lg shadow-lg mx-auto"
            />
            <Link
              href="/flowchart"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Full Size Flowchart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
