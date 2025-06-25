import React from "react";
import image from "../assets/graphics/failed.jpg";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@mantine/core";

const SubscriptionPaymentFailed = () => {
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
    enabled: !!subscriptionId
  });
  return (
    <div className="min-h- flex items-center justify-center ">
      {loadingSub ? (
        <div className="flex justify-center items-center gap-1 mt-20">
            <p>Please wait...</p>
            <Loader size={23}/>

        </div>
      ) : (
        <div className=" text-center mt-10">
          <h2 className="text-2xl font-semibold mb-2 text-brown-500">
            Your Payment was cancelled or Failed!
          </h2>
          <p className="text-brown-500 text-lg">
            Your payment for{" "}
            {subscriptionData?.data?.name || "Premium subscription"} was not
            successful ❌
          </p>
          <p>Go back and try again</p>
          <div className="flex justify-center mb-6">
            <div className="">
              <div className="flex items-center justify-center">
                <img src={image} alt="" className="h-[300px]" />
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Unfortunately, your payment was not successful. Please try again or
            contact support if the issue persists.
          </p>
          <Link
            to={`/${subscriptionData?.data?.serviceName}`}
            className="text-brown-100 font-bold rounded-md bg-brown-500 px-4 py-3  "
          >
            Back to {subscriptionData?.data?.serviceName} Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPaymentFailed;
