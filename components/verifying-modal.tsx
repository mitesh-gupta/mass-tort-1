"use client";

import { useEffect } from "react";

interface VerifyingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function VerifyingModal({
  isOpen,
  onComplete,
}: VerifyingModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onComplete();
    }, 45000); // 45 seconds

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-8">
          Secure Bank Verification
        </h2>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            <div
              className="w-4 h-4 bg-(--custom-color) rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-4 h-4 bg-(--custom-color) rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-4 h-4 bg-(--custom-color) rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Verifying Bank Credentials...
        </h3>
        <p className="text-gray-700">
          Please do not close this window. This process can take up to 45
          seconds to securely confirm your account.
        </p>
      </div>
    </div>
  );
}
