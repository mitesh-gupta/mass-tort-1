"use client";

export default function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap gap-6 md:gap-8 mb-6">
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            508 Compliance
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Privacy, Policies, and Legal Information
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Freedom of Information Act (FOIA)
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Careers at Law Firm
          </a>
        </div>
        <p className="text-sm text-gray-300">
          An official claims website. Operated by the Claims Administrator.
        </p>
      </div>
    </footer>
  );
}
