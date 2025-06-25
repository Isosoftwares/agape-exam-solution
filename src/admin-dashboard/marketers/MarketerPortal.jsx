import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  Clock
} from 'lucide-react';
import axios from '../api/axios';

const MarketerPortal = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [currentPage, setCurrentPage] = useState(1);
  
  // In a real app, get marketer ID from auth context
  const marketerId = "YOUR_MARKETER_ID"; // Replace with actual marketer ID

  // Fetch marketer analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['marketer-analytics', marketerId, dateRange],
    queryFn: async () => {
      const response = await axios.get(`/analytics/marketer/${marketerId}?range=${dateRange}`);
      return response.data;
    }
  });

  // Fetch marketer's referrals
  const { data: referralsData, isLoading: referralsLoading } = useQuery({
    queryKey: ['my-referrals', marketerId, currentPage],
    queryFn: async () => {
      const response = await axios.get(`/marketers/${marketerId}/referrals?page=${currentPage}&limit=10`);
      return response.data;
    }
  });

  const marketer = analyticsData?.data?.marketer;
  const stats = analyticsData?.data?.stats;
  const dailyPerformance = analyticsData?.data?.dailyPerformance || [];
  const recentReferrals = analyticsData?.data?.recentReferrals || [];
  const referrals = referralsData?.data?.referrals || [];
  const pagination = referralsData?.data?.pagination || {};

  const copyReferralLink = () => {
    if (!marketer?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${marketer.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  const copyReferralCode = () => {
    if (!marketer?.referralCode) return;
    navigator.clipboard.writeText(marketer.referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const shareOnSocial = (platform) => {
    if (!marketer?.referralCode) return;
    
    const link = `${window.location.origin}/signup?ref=${marketer.referralCode}`;
    const text = "Join this amazing platform and get academic support!";
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {marketer?.name}!
              </h1>
              <p className="text-gray-600 mt-1">Track your referral performance and earnings</p>
              
              {marketer?.status !== 'Active' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Your account status is: <strong>{marketer?.status}</strong>
                    {marketer?.status === 'Suspended' && 
                      '. Please contact support for assistance.'}
                  </p>
                </div>
              )}
            </div>

            {/* Referral Tools */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Your Referral Tools</h3>
              
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
                      onClick={() => shareOnSocial('twitter')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="px-3 py-1 bg-blue-700 text-white rounded text-sm hover:bg-blue-800"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => shareOnSocial('whatsapp')}
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalReferrals || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.totalEarnings)}
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
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.pendingEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.avgCommission)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
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
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="_id" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  name === 'earnings' ? formatCurrency(value) : value,
                  name === 'earnings' ? 'Earnings' : 'Referrals'
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
        </div>

        {/* Recent Activity and All Referrals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {recentReferrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent referrals</p>
              ) : (
                <div className="space-y-4">
                  {recentReferrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New referral: {referral.client?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(referral.commissionAmount)}
                        </p>
                        <span className={getStatusBadge(referral.status)}>
                          {referral.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Commission Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commission Rate</span>
                  <span className="font-medium">{marketer?.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Earned</span>
                  <span className="font-medium">{formatCurrency(stats?.totalEarnings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Paid Out</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(stats?.paidEarnings)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">
                    {formatCurrency(stats?.pendingEarnings)}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Value Generated</span>
                    <span className="font-medium">{formatCurrency(stats?.totalClientValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Referrals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Your Referrals</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralsLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : referrals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No referrals found
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr key={referral._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {referral.client?.userName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{referral.client?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(referral.commissionAmount)}
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
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
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
    </div>
  );
};

export default MarketerPortal;