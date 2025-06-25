import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Check,
  X,
  Clock,
  DollarSign,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CommissionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [marketerFilter, setMarketerFilter] = useState("");
  const [selectedReferrals, setSelectedReferrals] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("30d");
  const axios = useAxiosPrivate();

  const queryClient = useQueryClient();

  // Fetch referrals
  const { data: referralsData, isLoading } = useQuery({
    queryKey: [
      "referrals",
      currentPage,
      statusFilter,
      marketerFilter,
      searchTerm,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(marketerFilter && { marketerId: marketerFilter }),
        ...(searchTerm && { search: searchTerm }),
      });
      const response = await axios.get(`/referrals?${params}`);
      return response.data;
    },
  });

  // Fetch commission summary
  const { data: summaryData } = useQuery({
    queryKey: ["commission-summary", marketerFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(marketerFilter && { marketerId: marketerFilter }),
      });
      const response = await axios.get(`/referrals/summary?${params}`);
      return response.data;
    },
  });

  // Fetch marketers for filter
  const { data: marketersData } = useQuery({
    queryKey: ["marketers-list"],
    queryFn: async () => {
      const response = await axios.get("/marketers?limit=100");
      return response.data;
    },
  });

  // Update referral status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }) => {
      const response = await axios.patch(`/referrals/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["referrals"]);
      queryClient.invalidateQueries(["commission-summary"]);
      toast.success("Referral status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ referralIds, status, notes }) => {
      const response = await axios.patch("/referrals/bulk/status", {
        referralIds,
        status,
        notes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["referrals"]);
      queryClient.invalidateQueries(["commission-summary"]);
      setSelectedReferrals([]);
      toast.success(
        `${data.data.modifiedCount} referrals updated successfully!`
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to bulk update");
    },
  });

  const referrals = referralsData?.data?.referrals || [];
  const pagination = referralsData?.data?.pagination || {};
  const marketers = marketersData?.data?.marketers || [];
  const summary = summaryData?.data || {};

  const handleSelectReferral = (referralId) => {
    setSelectedReferrals((prev) =>
      prev.includes(referralId)
        ? prev.filter((id) => id !== referralId)
        : [...prev, referralId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReferrals.length === referrals.length) {
      setSelectedReferrals([]);
    } else {
      setSelectedReferrals(referrals.map((r) => r._id));
    }
  };

  const handleBulkAction = (status) => {
    if (selectedReferrals.length === 0) {
      toast.warning("Please select referrals to update");
      return;
    }

    const notes = prompt(
      `Add notes for ${status.toLowerCase()} status (optional):`
    );
    bulkUpdateMutation.mutate({
      referralIds: selectedReferrals,
      status,
      notes: notes || "",
    });
  };

  const handleStatusChange = (referral, newStatus) => {
    const notes = prompt(
      `Add notes for ${newStatus.toLowerCase()} status (optional):`
    );
    updateStatusMutation.mutate({
      id: referral._id,
      status: newStatus,
      notes: notes || "",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Commission Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage referral commissions and payouts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("Paid")}
                disabled={
                  selectedReferrals.length === 0 || bulkUpdateMutation.isPending
                }
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Check size={20} />
                Mark as Paid ({selectedReferrals.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by marketer refferal code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={marketerFilter}
              onChange={(e) => setMarketerFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Marketers</option>
              {marketers.map((marketer) => (
                <option key={marketer._id} value={marketer._id}>
                  {marketer.firstName} {marketer.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Commission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.totalCommission || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.pendingCommission || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Out</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.paidCommission || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.cancelledCommission || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Referral Commissions
              </h3>
              <div className="flex gap-2">
                {selectedReferrals.length > 0 && (
                  <>
                    <button
                      onClick={() => handleBulkAction("Cancelled")}
                      disabled={bulkUpdateMutation.isPending}
                      className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-md text-sm"
                    >
                      Cancel Selected
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedReferrals.length === referrals.length &&
                        referrals.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : referrals.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No referrals found
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr key={referral._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReferrals.includes(referral._id)}
                          onChange={() => handleSelectReferral(referral._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {referral.marketer?.firstName}{" "}
                            {referral.marketer?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.marketer?.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            Code: {referral.referralCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {referral.client?.userName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.client?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(referral.commissionAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {referral.commissionRate}% rate
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(referral.clientValue || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(referral.status)}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedReferral(referral);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {referral.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(referral, "Paid")
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Mark as paid"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(referral, "Cancelled")
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referral Details Modal */}
      <ReferralDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        referral={selectedReferral}
        onStatusUpdate={(status, notes) => {
          updateStatusMutation.mutate({
            id: selectedReferral._id,
            status,
            notes,
          });
          setShowDetailsModal(false);
        }}
      />
    </div>
  );
};

// Referral Details Modal Component
const ReferralDetailsModal = ({
  isOpen,
  onClose,
  referral,
  onStatusUpdate,
}) => {
  const [notes, setNotes] = useState("");

  if (!isOpen || !referral) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Referral Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Marketer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Marketer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.marketer?.firstName} {referral.marketer?.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.marketer?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Referral Code
                </label>
                <p className="mt-1 text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                  {referral.referralCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commission Rate
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.commissionRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.client?.userName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.client?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Spent
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatCurrency(referral.client?.totalSpent || 0)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joined Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {referral.client?.createdAt
                    ? new Date(referral.client.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Commission Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Commission Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commission Amount
                </label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  {formatCurrency(referral.commissionAmount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Value
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatCurrency(referral.clientValue || 0)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    referral.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : referral.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {referral.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(referral.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update Actions */}
          {referral.status === "Pending" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Update Status
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onStatusUpdate("Paid", notes)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => onStatusUpdate("Cancelled", notes)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionDashboard;
