// components/PayMarketerModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const PayMarketerModal = ({ isOpen, onClose, marketer }) => {
  const axios = useAxiosPrivate();

  // API function to process payment
  const processPayment = async (paymentData) => {
    const response = await axios.post(`/marketers/pay`, paymentData);
    return response.data;
  };
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    reference: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // TanStack Query mutation for processing payment
  const processPaymentMutation = useMutation({
    mutationFn: processPayment,
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["marketers"] });
      queryClient.invalidateQueries({
        queryKey: ["marketer-payments", marketer?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["marketer", marketer?.id] });

      // Show success message
      toast.success(
        `Payment of $${paymentData.amount} processed successfully!`
      );

      // Reset form and close modal
      setPaymentData({
        amount: "",
        paymentMethod: "Bank Transfer",
        reference: "",
        description: "",
      });
      onClose();
    },
    onError: (error) => {
      // Handle different error scenarios
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process payment";
      toast.error(errorMessage);
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPaymentData({
        amount: "",
        paymentMethod: "Bank Transfer",
        reference: "",
        description: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // Validation
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(paymentData.amount) > marketer?.balance) {
      toast.error("Payment amount cannot exceed balance");
      return;
    }

    // Additional validation
    if (parseFloat(paymentData.amount) > 999999.99) {
      toast.error("Payment amount is too large");
      return;
    }

    paymentData.marketerId = marketer._id;


    // Trigger the mutation
    processPaymentMutation.mutate(paymentData);
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const isLoading = processPaymentMutation.isPending;

  if (!marketer) return null;

  return (
    <div className=" flex items-center justify-center pb-4">
      <div className="bg-white rounded-lg px-4 w-full">
        <h2 className="text-xl font-bold mb-4">Pay Marketer</h2>

        {/* Marketer Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-900">
            {marketer.firstName} {marketer.lastName}
          </h3>
          <p className="text-sm text-gray-600">{marketer.email}</p>
          <p className="text-sm text-gray-600">
            Available Balance:{" "}
            <span className="font-medium text-green-600">
              ${marketer.balance?.toFixed(2) || "0.00"}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              required
              min="0.01"
              max={marketer.balance || 0}
              step="0.01"
              value={paymentData.amount}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Crypto">Cryptocurrency</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference/Transaction ID
            </label>
            <input
              type="text"
              name="reference"
              value={paymentData.reference}
              onChange={handleChange}
              disabled={isLoading}
              maxLength="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Optional reference number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={paymentData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows="3"
              maxLength="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
              placeholder="Optional payment description"
            />
            <p className="text-xs text-gray-500 mt-1">
              {paymentData.description.length}/500 characters
            </p>
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
              disabled={
                isLoading ||
                !paymentData.amount ||
                parseFloat(paymentData.amount) <= 0
              }
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Process Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayMarketerModal;
