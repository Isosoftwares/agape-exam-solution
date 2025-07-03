import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Copy,
  ExternalLink,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Share2,
  Download,
  Eye,
  Clock,
  LogIn,
  Lock,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const MarketerPortal = () => {
  const axios = useAxiosPrivate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [marketerData, setMarketerData] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: "",
    referralCode: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  const [dateRange, setDateRange] = useState("30d");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(""); // Filter by status

  // Authentication function
  const authenticateMarketer = async (e = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validate form
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!loginForm.referralCode.trim()) {
      errors.referralCode = "Referral code is required";
    } else if (loginForm.referralCode.length !== 6) {
      errors.referralCode = "Referral code must be exactly 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginLoading(true);
    setLoginErrors({});

    try {
      const response = await axios.post("/auth/marketers/authenticate", {
        email: loginForm.email.trim(),
        referralCode: loginForm.referralCode.trim().toUpperCase(),
      });

      if (response.data.success) {
        setMarketerData(response.data.marketer);
        setIsAuthenticated(true);
        toast.success("Successfully logged in!");
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Authentication failed. Please check your credentials.";
      toast.error(errorMessage);
      setLoginErrors({ general: errorMessage });
    } finally {
      setLoginLoading(false);
    }
  };

  // Fetch payments data
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: [
      "marketer-payments",
      marketerData?._id,
      paymentsPage,
      paymentStatus,
    ],
    queryFn: async () => {
      if (!marketerData?._id) return null;

      const params = new URLSearchParams({
        page: paymentsPage.toString(),
        limit: "10",
        marketerId: marketerData._id,
      });

      if (paymentStatus) {
        params.append("status", paymentStatus);
      }

      const response = await axios.get(`/marketers/payments?${params}`);
      return response.data;
    },
    enabled: !!marketerData?._id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLoginInputChange = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setMarketerData(null);
    setLoginForm({ email: "", referralCode: "" });
    setCurrentPage(1);
    setPaymentsPage(1);
    setPaymentStatus("");
    toast.info("Logged out successfully");
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Marketer Portal
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <div className="space-y-6">
              {loginErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{loginErrors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      handleLoginInputChange("email", e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      loginErrors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    disabled={loginLoading}
                    onKeyPress={(e) =>
                      e.key === "Enter" && authenticateMarketer()
                    }
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-600 text-xs mt-1">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              {/* Referral Code Field */}
              <div>
                <label
                  htmlFor="referralCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Referral Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="referralCode"
                    type="text"
                    value={loginForm.referralCode}
                    onChange={(e) =>
                      handleLoginInputChange(
                        "referralCode",
                        e.target.value.toUpperCase()
                      )
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono tracking-wider ${
                      loginErrors.referralCode
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="ABC123"
                    maxLength={6}
                    disabled={loginLoading}
                    onKeyPress={(e) =>
                      e.key === "Enter" && authenticateMarketer()
                    }
                  />
                </div>
                {loginErrors.referralCode && (
                  <p className="text-red-600 text-xs mt-1">
                    {loginErrors.referralCode}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Enter your 6-character referral code
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={authenticateMarketer}
                disabled={loginLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loginLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Access Dashboard"
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don't have access? Contact your administrator for your referral
                code.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content (existing functionality)
  const marketer = marketerData;

  const copyReferralLink = () => {
    if (!marketer?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${marketer.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  const copyReferralCode = () => {
    if (!marketer?.referralCode) return;
    navigator.clipboard.writeText(marketer.referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  const shareOnSocial = (platform) => {
    if (!marketer?.referralCode) return;

    const link = `${window.location.origin}/signup?ref=${marketer.referralCode}`;
    const text = "Join this amazing platform and get academic support!";

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(link)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          link
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          link
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + link
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    const getVisiblePages = () => {
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {marketer?.name}!
                </h1>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Logout
                </button>
              </div>
              <p className="text-gray-600 mt-1">
                Track your referral performance and earnings
              </p>

              {marketer?.status !== "Active" && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Your account status is: <strong>{marketer?.status}</strong>
                    {marketer?.status === "Suspended" &&
                      ". Please contact support for assistance."}
                  </p>
                </div>
              )}
            </div>

            {/* Referral Tools */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Your Referral Tools
              </h3>

              <div className="space-y-3">
                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-2 rounded border text-lg font-mono">
                      {marketer?.referralCode}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="Copy code"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                {/* Referral Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/signup?ref=${marketer?.referralCode}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border rounded text-sm"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="Copy link"
                    >
                      <Copy size={18} />
                    </button>
                    <a
                      href={`${window.location.origin}/signup?ref=${marketer?.referralCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="Test link"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share on Social Media
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => shareOnSocial("twitter")}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial("facebook")}
                      className="px-3 py-1 bg-blue-700 text-white rounded text-sm hover:bg-blue-800"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => shareOnSocial("linkedin")}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => shareOnSocial("whatsapp")}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Referrals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketer?.totalReferrals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(marketer?.totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(marketer?.balance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Commission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    marketer?.totalEarnings /
                      Math.max(marketer?.totalReferrals, 1)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments History Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
              Payment History
            </h2>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
             

              <button
                onClick={() => refetchPayments()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Payment Table */}
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : paymentsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">
                Error loading payments: {paymentsError.message}
              </p>
            </div>
          ) : !paymentsData?.payments?.length ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payments found
              </h3>
              <p className="text-gray-600">
                {paymentStatus
                  ? `No ${paymentStatus.toLowerCase()} payments found.`
                  : "You haven't received any payments yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
                        Prev Bal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New Bal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
               
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentsData.payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.paidAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">
                              {formatCurrency(payment.amount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(payment?.previousBalance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(payment?.newBalance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.paymentMethod}
                        </td>
                      
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.reference || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {payment.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {paymentsData.payments.map((payment) => (
                  <div key={payment._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900">
                          {formatDate(payment.paidAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="text-gray-900">
                          {payment.paymentMethod}
                        </span>
                      </div>
                      {payment.reference && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <span className="text-gray-900">
                            {payment.reference}
                          </span>
                        </div>
                      )}
                      {payment.description && (
                        <div className="mt-2">
                          <span className="text-gray-600">Description:</span>
                          <p className="text-gray-900 mt-1">
                            {payment.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                currentPage={paymentsPage}
                totalPages={paymentsData?.pagination?.total || 1}
                onPageChange={setPaymentsPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketerPortal;
