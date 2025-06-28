// components/EditMarketerModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const EditMarketerModal = ({ onClose, marketer }) => {
  const axios = useAxiosPrivate();
  // API function to update marketer
  const updateMarketer = async ({ data }) => {
    const response = await axios.patch(`/marketers/${marketer?._id}`, data);
    return response.data;
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    commissionRate: 10,
  });

  const queryClient = useQueryClient();

  // TanStack Query mutation for updating marketer
  const updateMarketerMutation = useMutation({
    mutationFn: updateMarketer,
    onSuccess: (data) => {
      // Invalidate and refetch marketers list
      queryClient.invalidateQueries({ queryKey: ["marketers"] });

      // Show success message
      toast.success("Marketer updated successfully!");

      // Close modal
      onClose();
    },
    onError: (error) => {
      // Handle different error scenarios
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update marketer";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (marketer) {
      setFormData({
        firstName: marketer.firstName || "",
        lastName: marketer.lastName || "",
        email: marketer.email || "",
        phoneNo: marketer.phoneNo || "",
        commissionRate: marketer.commissionRate || 10,
      });
    }
  }, [marketer]);

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNo
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Commission rate validation
    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      toast.error("Commission rate must be between 0 and 100");
      return;
    }

    // Trigger the mutation
    updateMarketerMutation.mutate({
      marketerId: marketer.id,
      data: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNo: formData.phoneNo.trim(),
        commissionRate: Number(formData.commissionRate),
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isLoading = updateMarketerMutation.isPending;

  return (
    <div className=" flex items-center justify-center ">
      <div className="bg-white rounded-lg px-6 w-full ">
        <h2 className="text-xl font-bold mb-4">Edit Marketer</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNo"
              required
              value={formData.phoneNo}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commission Rate (%)
            </label>
            <input
              type="number"
              name="commissionRate"
              min="0"
              max="100"
              step="0.01"
              required
              value={formData.commissionRate}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Marketer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMarketerModal;
