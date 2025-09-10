import React, { useEffect, useState } from "react";
import { Pagination } from "@mantine/core";
import { DatePickerInput, MonthPickerInput } from "@mantine/dates";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa";

function Clients() {
  const [opened, { open, close }] = useDisclosure(false);
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [name, setName] = useDebouncedState("", 500);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for API (YYYY-MM format)
  const formatMonthForAPI = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // No padding, so 5 instead of 05
    const day = 13; // You can change this to 1 for first day or any specific day
    return `${year}/${month}/${day}`;
  };
  const getUsers = () => {
    const monthParam = selectedMonth
      ? `&month=${formatMonthForAPI(selectedMonth)}`
      : "";
    console.log(monthParam);
    return axios.get(
      `/client?page=${activePage}&perPage=${perPage}&searchTerm=${name}&userType=${"client"}${monthParam}`
    );
  };

  const {
    isLoading: loadingUsers,
    data: usersData,
    refetch,
    isRefetching: refetchingUsers,
  } = useQuery({
    queryKey: [`clients-`, activePage, perPage, name, selectedMonth],
    queryFn: getUsers,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(usersData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, name, selectedMonth]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [name, selectedMonth]);

  const updateStatusFunction = (data) => {
    return axios.patch(`/auth/update-status`, data);
  };

  const {
    mutate: updateStatusMutate,
    isLoading: loadingUpdateStatus,
    error,
  } = useMutation({
    mutationFn: updateStatusFunction,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`${"clients-"}`]);
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (clientId, status) => {
    if (!clientId) return toast.error("Error!");
    const data = {
      userId: clientId,
      status: status === "Active" ? "Suspended" : "Active",
      userType: "client",
    };

    updateStatusMutate(data);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setName("");
    setSelectedMonth(null);
    setPage(1);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    return status === "Active"
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-red-100 text-red-800`;
  };

  // Get action button styling
  const getActionButtonClass = (status) => {
    return status === "Active"
      ? "bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
      : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaUsers className="text-blue-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        </div>
        <p className="text-gray-600">Manage and monitor client accounts</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFilter />
              <span>Filters</span>
              <FaChevronDown
                className={`transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-4 gap-4 ${
              showFilters ? "block" : "hidden lg:grid"
            }`}
          >
            {/* Search Filter */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name..."
                defaultValue={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Month Picker */}
            <div className="relative">
              <MonthPickerInput
                placeholder="Filter by join month"
                value={selectedMonth}
                styles={{
                  input: {
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    "&:focus": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 2px rgb(37 99 235 / 0.2)",
                    },
                  },
                }}
                onChange={setSelectedMonth}
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center">
              <span className="text-gray-600 font-medium">
                {usersData?.data?.count || 0} clients found
              </span>
            </div>

            {/* Reset Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(name || selectedMonth) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {name && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {name}
                  <button
                    onClick={() => setName("")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedMonth && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Month:{" "}
                  {selectedMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingUsers || refetchingUsers ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size={25} />
                      <span className="ml-2 text-gray-600">
                        Loading clients...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : usersData?.data?.message ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      <FaUsers className="mx-auto text-4xl mb-2 opacity-50" />
                      <p>{usersData?.data?.message}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usersData?.data?.clients?.map((item, index) => {
                  const displayIndex = (activePage - 1) * perPage + index + 1;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {displayIndex}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/dashboard/clients/${item?._id}`}
                          className="font-semibold text-blue-600 hover:text-blue-800 transition-colors capitalize"
                        >
                          {item?.email?.split("@")[0]}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.phoneNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(item?.status)}>
                          {item?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/clients/${item?._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                          >
                            <FaEye size={12} />
                            View
                          </Link>
                          <button
                            disabled={loadingUpdateStatus}
                            className={`inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${getActionButtonClass(
                              item.status
                            )}`}
                            onClick={() => {
                              onSubmitting(item?._id, item?.status);
                            }}
                          >
                            {item.status === "Active" ? (
                              <>
                                <FaUserTimes size={12} />
                                Suspend
                              </>
                            ) : (
                              <>
                                <FaUserCheck size={12} />
                                Activate
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(activePage - 1) * perPage + 1} to{" "}
              {Math.min(activePage * perPage, usersData?.data?.count || 0)} of{" "}
              {usersData?.data?.count || 0} results
            </div>
            <Pagination
              total={totalPages || 0}
              page={activePage}
              color="blue"
              onChange={setPage}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;
