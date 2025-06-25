import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Subscriptions({ close, handleClose, serviceName, inModal }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const getSubscriptions = () => {
    return axios.get(`/subscriptions?serviceName=${serviceName}`);
  };

  const {
    isLoading: loadingSubs,
    data: subscriptionsData,
    refetch,
    isRefetching: refetchingSubs,
  } = useQuery({
    queryKey: [`subscriptions-hesi-${serviceName}`],
    queryFn: getSubscriptions,
    keepPreviousData: true,
  });

  const splitStringIntoArray = (str) => {
    return str.split(",").map((item) => item.trim());
  };

  // Subscribe function
  const subscribeFn = (data) => {
    return axios.post("/subscriptions/subscribe", data);
  };

  const {
    mutate: subscribeMutate,
    isPending: loadingSubscribe,
    error,
  } = useMutation({
    mutationFn: subscribeFn,
    onSuccess: (response) => {
      const url = response.data.url;
      const text = response.data.message;
      close && handleClose();
      if (url !== "No url") {
        window.location = url;
      }
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";
      toast.error(text);
    },
  });

  const numberOfDays = (duration) => {
    return `${duration * 30} Days Access`;
  };

  return (
    <div className="py-16">
      {/* Header Section */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
          <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
          <span>Choose Your Plan</span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-black text-primary">
          {serviceName} Premium Packages
        </h2>

        <p className="text-lg text-dark/70 max-w-2xl mx-auto">
          Unlock your potential with our comprehensive study packages and 24/7
          expert support
        </p>
      </div>

      {/* Loading State */}
      {loadingSubs ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-primary font-medium">
              Loading subscription plans...
            </span>
          </div>
        </div>
      ) : (
        /* Subscription Cards */
        <div
          className={`grid gap-8 ${
            inModal ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {subscriptionsData?.data?.map((item, index) => (
            <div
              key={index}
              className={`relative group ${
                item?.recommended
                  ? "bg-white border-2 border-secondary shadow-2xl shadow-secondary/20 "
                  : "bg-white border-2 border-tertiary/30 hover:border-primary/30 shadow-xl hover:shadow-2xl"
              } rounded-3xl overflow-hidden transition-all duration-300 `}
            >
              {/* Recommended Badge */}
              {item?.recommended && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div
                className={`p-8 pt-14 ${
                  item?.recommended
                    ? "bg-gradient-to-br from-secondary/5 to-primary/5"
                    : "bg-tertiary/5"
                }`}
              >
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-primary">
                    {item?.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-black text-primary">
                        ${item?.amount}
                      </span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm text-primary font-medium">
                        {numberOfDays(item?.noOfMonths)}
                      </span>
                    </div>
                  </div>

                  {item?.description && (
                    <p className="text-dark/70 text-sm leading-relaxed">
                      {item?.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-primary mb-4 flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    What's Included
                  </h4>

                  <div className="space-y-3">
                    {splitStringIntoArray(item?.points)?.map(
                      (point, pointIndex) => (
                        <div
                          key={pointIndex}
                          className="flex items-start space-x-3 group/item"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center group-hover/item:bg-secondary/30 transition-colors duration-300">
                            <IoMdCheckmarkCircle
                              size={16}
                              className="text-secondary"
                            />
                          </div>
                          <p className="text-dark/80 text-sm leading-relaxed flex-1">
                            {point}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    disabled={loadingSubscribe}
                    className={`group w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      item?.recommended
                        ? "bg-secondary hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-secondary/25"
                        : "bg-primary hover:bg-dark text-white shadow-lg hover:shadow-xl hover:shadow-primary/25"
                    } hover:scale-105`}
                    onClick={() => {
                      if (!auth?.userId) {
                        return navigate("/signup", {
                          state: { dashboardPath: `/${serviceName}` },
                        });
                      }
                      subscribeMutate({
                        clientId: auth?.userId,
                        subscriptionId: item?._id,
                        serviceName: serviceName,
                      });
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loadingSubscribe ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Please Wait...
                        </>
                      ) : (
                        <>
                          Get Started
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            ></path>
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
