"use client";

import { useState } from "react";
import SignInModal from "./sign-in-modal";

export default function HeroSection({ setCurrentPage }: any) {
  const [showModal, setShowModal] = useState(false);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleSignInWithClaimId = () => {
    setShowModal(false);
    setCurrentPage("form");
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <a href="/" className="text-blue-600 hover:underline">
            Home
          </a>
          <span className="mx-2">/</span>
          <span>Apply for Disbursement</span>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl font-bold mb-4">
          Apply for a Personal Injury and Mass Tort Claim Disbursement
        </h2>

        {/* Subheading */}
        <p className="text-xl text-gray-700 mb-6 font-semibold">
          Claim Application for Mass Tort Benefits (Standard Form 95 – SF-95)
        </p>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          If you've experienced personal injury affecting your physical or
          mental health, you may qualify for compensation through a Mass Tort
          claim.
        </p>

        {/* List */}
        <div className="bg-gray-50 p-6 rounded mb-8">
          <p className="font-semibold text-gray-900 mb-4">
            Personal injury claims may include, but are not limited to:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span>•</span>
              <span>Faulty or defective product use or circulation</span>
            </li>
            <li className="flex gap-3">
              <span>•</span>
              <span>Physical, emotional, or mental abuse</span>
            </li>
            <li className="flex gap-3">
              <span>•</span>
              <span>Exposure to unsafe or harmful environments</span>
            </li>
            <li className="flex gap-3">
              <span>•</span>
              <span>
                Financial or monetary damages resulting directly or indirectly
                from product use or unsafe conditions
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleApplyClick}
          className="bg-(--custom-color) hover:bg-(--custom-color-hover) text-white px-6 py-3 rounded font-semibold mb-8"
        >
          Apply online now to begin your claim
        </button>
      </div>

      <SignInModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSignInWithClaimId={handleSignInWithClaimId}
      />
    </>
  );
}
