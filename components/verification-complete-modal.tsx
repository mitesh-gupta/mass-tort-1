"use client";

import { CheckCircle } from "lucide-react";

interface VerificationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationCompleteModal({
  isOpen,
  onClose,
}: VerificationCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Verification Complete!
        </h2>

        <p className="text-gray-700 mb-8">
          Your bank account details have been successfully verified. You can now
          submit your main application form.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-(--custom-color) hover:bg-(--custom-color-hover) text-white font-bold py-2 rounded"
        >
          Return to Application
        </button>
      </div>
    </div>
  );
}
