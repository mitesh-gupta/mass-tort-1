"use client";

export default function Navigation({ currentPage, setCurrentPage }: any) {
  return (
    <>
      {/* Top banner */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 md:px-8 md:py-3 text-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              🇺🇸 An official website of the United States government
            </span>
            <button className="text-blue-600 hover:underline text-xs">
              Here's how you know
            </button>
          </div>
          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700">
            Talk to the Claim Support Team Line now
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              CLAIMS ADMINISTRATOR
            </h1>
            <div className="flex gap-4 items-center">
              <button className="hover:underline text-sm">About Us</button>
              <button className="hover:underline text-sm">
                Find a Legal Rep
              </button>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold">
                Sign in to My Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
