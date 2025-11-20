"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function StepsSection() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (step: string) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
      {/* Step 1 */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-(--custom-color) flex items-center justify-center shrink-0 bg-white">
            <span className="font-bold text-(--custom-color)">1</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Check Your Eligibility
            </h4>
            <p className="text-gray-700 mb-3">
              Before you begin, confirm that you meet our eligibility
              requirements for claim enrollment and disbursement.
            </p>

            {/* Yellow note box */}
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> We can help you
                connect with your bank — regardless of your banking history or
                institution type.
              </p>
            </div>

            {/* Expandable section */}
            <button
              onClick={() => toggleStep("step1")}
              className="flex items-center gap-2 text-gray-900 font-semibold hover:bg-gray-100 p-2 rounded w-full"
            >
              <span>
                What are the eligibility requirements to apply for your claim
                disbursement process?
              </span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expandedStep === "step1" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedStep === "step1" && (
              <div className="mt-4 pl-6 text-gray-700 space-y-2">
                <p className="mb-3">
                  You may be eligible for disbursement if all of the following
                  statements are true:
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You have already applied for a class action or Mass Tort
                      claim, and your claim status remains active.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You have access to your active case ID number.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You maintain an active bank account with one of our
                      affiliated banks (such as Wells Fargo or any Federal
                      Credit Union).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Your affiliated bank account has at least 12 months of
                      transaction history with no fraudulent activity in the
                      past 12 months.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0 bg-white">
            <span className="font-bold text-blue-600">2</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Gather Your Information
            </h4>
            <p className="text-gray-700 mb-3">
              Before starting your application, please have the following
              information ready:
            </p>

            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Law firm(s) representing your claim (include details if your
                  case has been transferred between law firms)
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Social Security Numbers for yourself and any dependents or
                  blood relatives eligible to receive claim benefits
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Valid bank account and routing number</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Card information (only required if bank authentication fails
                  more than twice)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-(--custom-color) flex items-center justify-center shrink-0 bg-white">
            <span className="font-bold text-(--custom-color)">3</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Start Your Application
            </h4>
            <p className="text-gray-700 mb-3">
              We'll guide you through each step of the process — it typically
              takes about 45 minutes to complete.
            </p>

            <button
              onClick={() =>
                setExpandedStep(expandedStep === "step3" ? null : "step3")
              }
              className="flex items-center gap-2 text-gray-900 font-semibold hover:bg-gray-100 p-2 rounded w-full"
            >
              <span>What Happens After You Apply?</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expandedStep === "step3" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedStep === "step3" && (
              <div className="mt-4 pl-6 text-gray-700 space-y-2">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Your disbursement request is usually processed within 24
                      business hours.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You'll receive an email confirmation explaining the next
                      steps in your claim disbursement process.
                    </span>
                  </li>
                </ul>
                <p className="mt-3 font-semibold">
                  Important: If you receive your confirmation email within 24
                  business hours, please do not submit another application. Call
                  us at +1 (484) 481-4841. We are here Monday through Friday,
                  8:00 a.m. to 5:00 p.m. ET.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign in box */}
      <div className="border-l-4 border-(--custom-color) bg-gray-50 p-6 rounded">
        <h4 className="font-bold text-gray-900 mb-4">
          Sign in or create an account
        </h4>
        <button className="bg-(--custom-color) hover:bg-(--custom-color-hover) text-white px-4 py-2 rounded font-semibold mb-4">
          Sign in
        </button>

        {/* Important note */}
        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> We have removed an
            option for disbursement process through check due to unwarranted
            delays and rise of identity theft cases revolving to the mass tort
            claims. The disbursement will be followed strictly through EFT's
            (Electronic fund transfers) into an eligible bank accounts.
          </p>
        </div>
      </div>

      {/* Help section */}
      <div className="mt-12 -mx-4 md:-mx-8 px-4 md:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Need help?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Technical Support
            </h3>
            <p className="text-gray-700 mb-4">
              If you have trouble using this online application, call our
              support line:
            </p>
            <p className="text-2xl font-bold text-(--custom-color) mb-2">
              800-LAW-CLAIM (529-2524)
            </p>
            <p className="text-sm text-gray-600">
              (TTY: 711) We are here Monday through Friday, 8:00 a.m. to 8:00
              p.m. ET.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Questions about the Lawsuit
            </h3>
            <p className="text-gray-700 mb-4">
              For questions specific to your settlement or case details, contact
              your accredited legal representative.
            </p>
            <a
              href="#"
              className="text-(--custom-color) hover:text-blue-700 font-semibold inline-flex items-center gap-1"
            >
              Get help from a Legal Representative →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
