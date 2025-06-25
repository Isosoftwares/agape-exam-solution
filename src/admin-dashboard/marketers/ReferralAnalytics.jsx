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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ReferralAnalytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMarketer, setSelectedMarketer] = useState("");
  const axios = useAxiosPrivate();

  // Fetch main analytics data
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["referral-analytics", dateRange, selectedMarketer],
    queryFn: async () => {
      const params = new URLSearchParams({
        range: dateRange,
        ...(selectedMarketer && { marketerId: selectedMarketer }),
      });
      const response = await axios.get(`/analytics/referrals?${params}`);
      return response.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch revenue analytics
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-analytics", dateRange],
    queryFn: async () => {
      const response = await axios.get(`/analytics/revenue?range=${dateRange}`);
      return response.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch marketers for filter dropdown
  const { data: marketersData } = useQuery({
    queryKey: ["marketers-list"],
    queryFn: async () => {
      const response = await axios.get("/marketers?limit=100&status=Active");
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch commission summary
  const { data: commissionData } = useQuery({
    queryKey: ["commission-summary", selectedMarketer, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(selectedMarketer && { marketerId: selectedMarketer }),
        ...(dateRange && {
          startDate: getStartDate(dateRange).toISOString(),
          endDate: new Date().toISOString(),
        }),
      });
      const response = await axios.get(`/referrals/summary?${params}`);
      return response.data;
    },
    retry: 2,
  });

  // Fetch recent referrals
  const { data: recentReferralsData } = useQuery({
    queryKey: ["recent-referrals", selectedMarketer],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "10",
        sort: "-createdAt",
        ...(selectedMarketer && { marketerId: selectedMarketer }),
      });
      const response = await axios.get(`/referrals?${params}`);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Helper function to calculate start date
  const getStartDate = (range) => {
    const now = new Date();
    switch (range) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "90d":
        return new Date(now.setDate(now.getDate() - 90));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  };

  // Process API data
  const marketers = marketersData?.data?.marketers || [];
  const analytics = analyticsData?.data || {};
  const revenue = revenueData?.data || {};
  const commission = commissionData?.data || {};
  const recentReferrals = recentReferralsData?.data?.referrals || [];

  // Process chart data
  const performanceData = (analytics.dailyData || []).map((item) => ({
    date: item._id,
    referrals: item.referrals || 0,
    earnings: item.earnings || 0,
    clientValue: item.clientValue || 0,
  }));

  const topMarketersData = (analytics.topMarketers || []).slice(0, 10);

  // Process conversion data for pie chart
  const conversionStats = analytics.conversionStats || [];
  const totalReferrals = conversionStats.reduce(
    (sum, stat) => sum + (stat.count || 0),
    0
  );

  const conversionData = [
    {
      name: "Paid",
      value:
        totalReferrals > 0
          ? Math.round(
              ((conversionStats.find((s) => s._id === "Paid")?.count || 0) /
                totalReferrals) *
                100
            )
          : 0,
      color: "#10B981",
      count: conversionStats.find((s) => s._id === "Paid")?.count || 0,
    },
    {
      name: "Pending",
      value:
        totalReferrals > 0
          ? Math.round(
              ((conversionStats.find((s) => s._id === "Pending")?.count || 0) /
                totalReferrals) *
                100
            )
          : 0,
      color: "#F59E0B",
      count: conversionStats.find((s) => s._id === "Pending")?.count || 0,
    },
    {
      name: "Cancelled",
      value:
        totalReferrals > 0
          ? Math.round(
              ((conversionStats.find((s) => s._id === "Cancelled")?.count ||
                0) /
                totalReferrals) *
                100
            )
          : 0,
      color: "#EF4444",
      count: conversionStats.find((s) => s._id === "Cancelled")?.count || 0,
    },
  ].filter((item) => item.value > 0); // Only show non-zero values

  // Stats from API data
  const stats = {
    totalReferrals: analytics.stats?.totalReferrals || 0,
    totalEarnings: analytics.stats?.totalEarnings || 0,
    conversionRate: analytics.stats?.conversionRate || 0,
    avgOrderValue: analytics.stats?.avgOrderValue || 0,
    totalRevenue: revenue.summary?.totalRevenue || 0,
    netRevenue: revenue.summary?.netRevenue || 0,
    roi: revenue.summary?.roi || 0,
  };

  // Recent activity processing
  const recentActivity = recentReferrals.map((referral) => ({
    id: referral._id,
    marketer: referral.marketer
      ? `${referral.marketer.firstName} ${referral.marketer.lastName}`
      : "Unknown Marketer",
    client: referral.client?.email || "Unknown Client",
    amount: referral.commissionAmount || 0,
    time: referral.createdAt,
    status: referral.status || "Unknown",
  }));

  const isLoading = analyticsLoading || revenueLoading;

  // Export functionality
  const exportData = async () => {
    try {
      const params = new URLSearchParams({
        type: "referrals",
        range: dateRange,
        ...(selectedMarketer && { marketerId: selectedMarketer }),
      });

      const response = await axios.get(`/analytics/export?${params}`);
      const exportedData = response.data.data || [];

      if (exportedData.length === 0) {
        toast.warning("No data available for export in the selected period");
        return;
      }

      // Create CSV content
      const csvHeaders = [
        "Date",
        "Marketer Name",
        "Marketer Email",
        "Client Email",
        "Referral Code",
        "Commission Amount",
        "Commission Rate",
        "Client Value",
        "Status",
      ];

      const csvRows = exportedData.map((item) => [
        new Date(item.createdAt).toLocaleDateString(),
        item.marketer
          ? `${item.marketer.firstName} ${item.marketer.lastName}`
          : "N/A",
        item.marketer?.email || "N/A",
        item.client?.email || "N/A",
        item.referralCode || "N/A",
        `$${(item.commissionAmount || 0).toFixed(2)}`,
        `${item.commissionRate || 0}%`,
        `$${(item.clientValue || 0).toFixed(2)}`,
        item.status || "Unknown",
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `referral_analytics_${dateRange}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportedData.length} records successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to export data. Please try again."
      );
    }
  };

  // Refresh all data
  const refreshData = () => {
    refetchAnalytics();
    toast.info("Refreshing analytics data...");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Format date for chart
  const formatChartDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (analyticsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <TrendingUp size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to fetch analytics data. Please try again.
          </p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Referral Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Track performance and insights from your affiliate program
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={exportData}
                disabled={isLoading || stats.totalReferrals === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedMarketer}
                onChange={(e) => setSelectedMarketer(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gray-200 rounded-lg w-12 h-12"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Referrals
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalReferrals.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">in selected period</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Commissions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalEarnings)}
                    </p>
                    <p className="text-xs text-gray-500">earned by marketers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">referral to paid</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Client Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.avgOrderValue)}
                    </p>
                    <p className="text-xs text-gray-500">per referral</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Over Time
            </h3>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading chart data...</p>
                </div>
              </div>
            ) : performanceData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Users className="text-gray-400 mb-4 mx-auto" size={48} />
                  <p className="text-gray-500">No performance data available</p>
                  <p className="text-sm text-gray-400">
                    for the selected period
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={(value, name) => [
                      name === "earnings" ? formatCurrency(value) : value,
                      name === "earnings"
                        ? "Earnings"
                        : name === "referrals"
                        ? "Referrals"
                        : "Client Value",
                    ]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="referrals"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="referrals"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="earnings"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Conversion Rate Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Referral Status Breakdown
            </h3>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading chart data...</p>
                </div>
              </div>
            ) : conversionData.length === 0 || totalReferrals === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Target className="text-gray-400 mb-4 mx-auto" size={48} />
                  <p className="text-gray-500">No referral data available</p>
                  <p className="text-sm text-gray-400">for status breakdown</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, count }) =>
                      `${name}: ${value}% (${count})`
                    }
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.count} referrals)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Marketers */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Marketers
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marketer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="ml-4">
                              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : topMarketersData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Users
                          className="mx-auto mb-4 text-gray-400"
                          size={48}
                        />
                        <p>No marketer performance data available</p>
                        <p className="text-sm text-gray-400">
                          for the selected period
                        </p>
                      </td>
                    </tr>
                  ) : (
                    topMarketersData.map((marketer, index) => (
                      <tr key={marketer._id || index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {marketer.name?.charAt(0) || "?"}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {marketer.name || "Unknown Marketer"}
                              </div>
                              {marketer.email && (
                                <div className="text-sm text-gray-500">
                                  {marketer.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(marketer.referrals || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(marketer.earnings || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Referral Activity
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 animate-pulse"
                    >
                      <div>
                        <div className="h-4 w-48 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-12 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp
                    className="mx-auto mb-4 text-gray-400"
                    size={48}
                  />
                  <p className="text-gray-500">No recent referral activity</p>
                  <p className="text-sm text-gray-400">
                    Check back later for updates
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.marketer} referred {activity.client}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleDateString()} at{" "}
                          {new Date(activity.time).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(activity.amount)}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralAnalytics;
