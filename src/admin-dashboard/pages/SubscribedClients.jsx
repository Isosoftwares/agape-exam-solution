import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import formatDateandTime from "../../utils/formatDateandTime";
import ReactSelect from "react-select";

function SubscribedClients() {
  const axios = useAxiosPrivate();
  const [hasSubscription, setHasSubscription] = useState("hasSubscription");
  const [subscriptionId, setSubscriptionId] = useState("");

  // get subs
  const getClientSWithSubs = async () => {
    return await axios.get(
      `/client-subscriptions?hasSubscription=${hasSubscription}&subscriptionId=${subscriptionId}`
    );
  };

  const {
    isLoading: loadingSubs,
    data: subsData,
    refetch: refetchSubscriptions,
    isRefetching: refetchingSubs,
  } = useQuery({
    queryFn: getClientSWithSubs,
    queryKey: [`get-subscribed-clients-dgdfgvdf`],
    keepPreviousData: true,
  });

  useEffect(() => {
    refetchSubscriptions();
  }, [hasSubscription, subscriptionId]);

  console.log(subsData?.data);

  // get subs in system
  const getSubscriptionsAdded = () => {
    return axios.get(`/subscriptions`);
  };

  const {
    isLoading: loadingSytemSubs,
    data: subscriptionsData,
    refetch,
    isRefetching: refetchingSystemSubs,
  } = useQuery({
    queryKey: [`subscriptions`],
    queryFn: getSubscriptionsAdded,
    keepPreviousData: true,
  });

  let subscriptionOptions =
    subscriptionsData?.data?.map((sub) => {
      const container = {};
      container.label = sub?.name;
      container.value = sub?._id;
      return container;
    }) || [];

  const ResetFilters = () => {
    setHasSubscription("hasSubscription");
    setSubscriptionId("");
  };
  return (
    <div>
      <p className="font-bold text-lg mb-3 ">
        Clients with/ without subscription{" "}
      </p>
      {/* filters */}
      <div className="bg-light py-3 px-2 rounded  ">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="">Filter clients</label>
            <select
              name=""
              id=""
              className="w-full p-[5px] py-3 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
              onChange={(e) => {
                setHasSubscription(e.target.value);
              }}
            >
              <option value="hasSubscription">With subscriptions</option>
              <option value="noSubscription">Without Subscriptions</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="block text-sm font-semibold text-gray-600 mb-1"
            >
              Subscription
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>
            {loadingSytemSubs ? (
              <div>Loading...</div>
            ) : (
              <ReactSelect
                options={subscriptionOptions}
                value={subscriptionOptions.find(
                  (sub) => sub.value === subscriptionId
                )}
                onChange={(selectedOption) => {
                  setSubscriptionId(selectedOption.value);
                }}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p>{subsData?.data?.count || 0} Result</p>
          <button
            className="bg-primary text-light px-2 py-1 rounded hover:bg-opacity-80 "
            onClick={ResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* table */}
      <div className="mb- pb-2 mt-3 ">
        {/* table */}
        <div className="overflow-x-auto overflow-y-auto  relative shadow-sm sm:rounded-md bg-white  ">
          <table className="w-full text-md text-left   ">
            <thead
              className={`text-xs text-gray-700 bg-[#ffffff] bg-opacity-30 border-b`}
            >
              <tr>
                <th
                  scope="col"
                  className="py-[8px] text-start px-3  text-gray-900 whitespace-nowrap"
                >
                  #
                </th>

                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Client
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Email
                </th>

                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Phone
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Subscriptions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {loadingSubs || refetchingSubs ? (
                <tr>
                  <td colSpan={8} className="text-center pl-[50%] py-4">
                    <LoadingSpinner size={30} />
                  </td>
                </tr>
              ) : !subsData?.data?.clients?.length ? (
                <tr>
                  <td colSpan={5} className="text-gray-800 text-center py-3  ">
                    <p>No client subscriptions found!</p>
                  </td>
                </tr>
              ) : (
                subsData?.data?.clients?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-[#f8f8f822]  "
                    >
                      <td className=" px-4 text-lg text-start py-3">
                        {index + 1}
                      </td>

                      <td className={`  py-2 px-1 text- text-start capitalize`}>
                        {item?.userName}
                      </td>

                      <td
                        className={`  py-2 px-1 text-center font-bold `}
                      >
                        {item?.email}
                      </td>

                      <td className={`  py-2 px-1 text- text-center`}>
                        {item?.phoneNo}
                      </td>

                      <td className={`  py-2 px-1 text- text-center  `}>
                        {item?.subscriptions?.length ? (
                          <div>
                            {item?.subscriptions?.map((item, index) => {
                              return (
                                <div key={index}>
                                  <div className="bg-gray-50 rounded-md mb-1 pb-1 ">
                                    <p>{item?.subscriptionId?.name}</p>
                                    <p className="text-xs">
                                      Expires:{item?.expiryDate?.split("T")[0]}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}{" "}
                          </div>
                        ) : (
                          <span>No subscriptions</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SubscribedClients;
