// components/ViewMarketerModal.jsx
import React, { useState } from "react";
import { Copy, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ViewMarketerModal = ({ onClose, marketer }) => {
  const axios = useAxiosPrivate();
  // API function to fetch marketer payments
  const fetchMarketerPayments = async () => {
    const response = await axios.get(`/marketers/payments?marketerId=${marketer?._id}`);
    return response.data;
  };
  // API function to fetch marketer details (if needed for real-time data)
  const fetchMarketerDetails = async () => {
    const response = await axios.get(`/marketers/${marketer?._id}`);
    return response.data;
  };
  const [activeTab, setActiveTab] = useState("details");

  // Query for fetching payment history
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["marketer-payments", marketer?._id],
    queryFn: () => fetchMarketerPayments(marketer?._id),
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 300000, // Cache for 5 minutes
  });

  // Query for real-time marketer details (optional)
  const { data: updatedMarketer, isLoading: marketerLoading } = useQuery({
    queryKey: ["marketer", marketer?._id],
    queryFn: () => fetchMarketerDetails(marketer?._id),
    enabled:  !!marketer?.id,
    staleTime: 60000, // Consider data fresh for 1 minute
    initialData: marketer, // Use prop data as initial data
  });

  // Use updated marketer data if available, otherwise fall back to prop
  const currentMarketer = updatedMarketer || marketer;

  // Load payments when payments tab is clicked
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "payments" && marketer?._id) {
      refetchPayments();
    }
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text, successMessage) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };


  if (!marketer) return null;

  const referralLink = `${window.location.origin}/sign-up?ref=${currentMarketer.referralCode}`;

  return (
    <div className=" flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full  overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Marketer Details</h2>
            {marketerLoading && (
              <p className="text-sm text-gray-500">Refreshing data...</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("details")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => handleTabChange("payments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment History
              {paymentsError && (
                <AlertCircle className="inline ml-1 w-4 h-4 text-red-500" />
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentMarketer.firstName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentMarketer.lastName}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentMarketer.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentMarketer.phoneNo}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referral Code
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {currentMarketer.referralCode}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      currentMarketer.referralCode,
                      "Referral code copied!"
                    )
                  }
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy referral code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referral Link
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 text-xs bg-gray-50 px-2 py-1 rounded border"
                />
                <button
                  onClick={() =>
                    copyToClipboard(referralLink, "Referral link copied!")
                  }
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy referral link"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Open referral link"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commission Rate
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentMarketer.commissionRate}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentMarketer.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : currentMarketer.status === "Suspended"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentMarketer.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Referrals
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentMarketer.totalReferrals || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Earnings
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  ${(currentMarketer.totalEarnings || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Balance
                </label>
                <p className="mt-1 font-bold text-sm text-gray-900">
                  ${(currentMarketer?.balance || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(currentMarketer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentMarketer.updatedAt
                    ? new Date(currentMarketer.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            {paymentsError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading payments
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      {paymentsError.response?.data?.message ||
                        paymentsError.message ||
                        "Failed to load payment history"}
                    </p>
                    <button
                      onClick={() => refetchPayments()}
                      className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!paymentsData?.payments?.length ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {paymentsError
                            ? "Unable to load payments"
                            : "No payments found"}
                        </td>
                      </tr>
                    ) : (
                      paymentsData?.payments?.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(
                              payment.paidAt || payment.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(payment.previousBalance || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(payment.newBalance || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.reference || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "Failed"
                                  ? "bg-red-100 text-red-800"
                                  : payment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* {payments.length > 0 && (
                  <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t">
                    Showing {payments.length} payment
                    {payments.length !== 1 ? "s" : ""}
                  </div>
                )} */}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMarketerModal;
