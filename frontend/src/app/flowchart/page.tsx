import Image from "next/image";
import Link from "next/link";

export default function FlowchartPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">StreamrTV Flowchart</h1>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <Image
            src="/flowchart.svg"
            alt="StreamrTV Flowchart Full Size"
            width={1200}
            height={900}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
