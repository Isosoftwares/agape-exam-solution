import React from "react";
import { Link, useParams } from "react-router-dom";
import image from "../assets/graphics/ssuccess.png";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loader } from "@mantine/core";

const SubscriptionPaymentSuccess = () => {
  const axios = useAxiosPrivate();
  const { subscriptionId } = useParams();

  const getSubscription = () => {
    return axios.get(`/subscriptions/one/${subscriptionId}`);
  };

  const {
    isLoading: loadingSub,
    data: subscriptionData,
    refetch,
    isRefetching: refetchingSub,
  } = useQuery({
    queryKey: [`subscription-${subscriptionId}`],
    queryFn: getSubscription,
    keepPreviousData: true,
  });

  return (
    <div className="min-h-[] flex items-center justify-center">
      {loadingSub ? (
        <div className="flex justify-center items-center gap-1 mt-20">
          <p>Please wait...</p>
          <Loader size={23} />
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">
            Your Payment was Successful!
          </h2>
          <p className="text-green-500 text-lg">
            Thank you! Your payment for{" "}
            <span className="font-bold text-lg">{subscriptionData?.data?.name || "Premium Subscription"}</span> was
            successful ✅
          </p>
          <div className="flex justify-center mb-6">
            <div className="">
              <div className="flex items-center justify-center">
                <img src={image} alt="" className="h-[300px]" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. An automated payment receipt will be
            sent to your registered email.
          </p>
          <Link
            to={`/${subscriptionData?.data?.serviceName}`}
            className="text-gray-100 font-bold rounded-md bg-primary px-4 py-3  "
          >
            Proceed to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPaymentSuccess;
