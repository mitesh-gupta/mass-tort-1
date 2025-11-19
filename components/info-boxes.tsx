"use client";

export default function InfoBoxes() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      {/* Have You Applied Before Box */}
      <div className="border-l-4 border-(--custom-color) bg-gray-50 p-6 rounded mb-12">
        <div className="flex gap-4">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">
              Have You Applied for Mass Tort Claims Before?
            </h3>
            <p className="text-gray-700">
              If you've already submitted an application, please{" "}
              <a
                href="#"
                className="text-(--custom-color) hover:underline font-semibold"
              >
                Sign in
              </a>{" "}
              to check your claim status.
            </p>
          </div>
        </div>
      </div>

      {/* What to Know Section */}
      <h3 className="text-2xl font-bold mb-8 text-gray-900">
        What to Know Before You Fill Out This Form
      </h3>
    </div>
  );
}
