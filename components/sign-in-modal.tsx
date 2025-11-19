"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";

export default function SignInModal({
  isOpen,
  onClose,
  onSignInWithClaimId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignInWithClaimId: () => void;
}) {
  const [showDisbursementDetails, setShowDisbursementDetails] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Claim Compensation Office
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Description */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in or create an account
            </h3>
            <p className="text-gray-700 text-sm">
              Please choose one of the options below to sign in or create an
              account to start, continue, or check the status of your claim
              application.
            </p>
          </div>

          {/* Sign In with Claim ID Button */}
          <button
            onClick={onSignInWithClaimId}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition"
          >
            <Lock size={20} />
            Sign in with Claim ID
          </button>

          {/* Login.gov / ID.me Button */}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition">
            Login.gov or ID.me
          </button>

          {/* Help Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Learn about creating a Login.gov or ID.me account
            </a>
          </div>

          {/* Disbursement Notice */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() =>
                setShowDisbursementDetails(!showDisbursementDetails)
              }
              className="w-full text-left"
            >
              <h4 className="font-bold text-gray-900 mb-3">
                Disbursement Notice
              </h4>
            </button>

            {showDisbursementDetails && (
              <div className="bg-gray-50 p-4 rounded space-y-3 text-sm">
                <p className="font-medium text-gray-900">Note:</p>
                <p className="text-gray-700">
                  As of **March 2025**, the option to receive disbursements by
                  check has been permanently discontinued in compliance with new
                  mandates from MDL (Multi-District Litigation) authorities.
                </p>
                <p className="text-gray-700">
                  This change was implemented due to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Increased delays associated with mailed check payments
                  </li>
                  <li>
                    A significant rise in identity theft and fraudulent activity
                    related to Mass Tort claim payments.
                  </li>
                </ul>
                <p className="text-gray-700">
                  To ensure faster, safer, and more secure payments, all
                  disbursements will now be made exclusively through
                  **Electronic Fund Transfers (EFTs)** into verified and
                  eligible bank accounts.
                </p>
              </div>
            )}
          </div>

          {/* Help and Support */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <h4 className="font-bold text-gray-900">Help and support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Sign-in errors
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Verifying your identity
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Deleting your account
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Common issues with Login.gov or ID.me
                </a>
              </li>
            </ul>
            <p className="text-sm text-gray-700 pt-3">
              Call our technical support line for help at{" "}
              <span className="font-semibold">484-481-4841</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
