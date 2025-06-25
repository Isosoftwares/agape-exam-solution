import { MonthPickerInput } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { Divider, Skeleton } from "@mantine/core";
import useAuth from "../../hooks/useAuth";
import SubscriptionGraph from "../components/SubscriptionGraph";

function AdminOverview() {
  const [value, setValue] = useState(new Date());
  const { auth } = useAuth();
  const handleChange = (date) => {
    setValue(new Date(date.setDate(date.getDate() + 1)));
  };

  function formatYearMonth(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const axios = useAxiosPrivate();
  const getOrdersStats = () => {
    return axios.get(`/dashboard`);
  };

  const {
    isLoading: loadingOrdersStats,
    data: ordersStatsData,
    refetch: refetchOrderStats,
    isRefetching: refetchingOrdersStats,
    isError: errorOrdersStats,
    error,
  } = useQuery({
    queryKey: [`dashboard-orders-stats`],
    queryFn: getOrdersStats,
  });

  // payments
  const getPaymentsFn = () => {
    return axios.get(
      `/dashboard/monthly-payments?month=${formatYearMonth(value)}`
    );
  };

  const {
    isLoading: loadingPaymentStats,
    data: paymentStatsData,
    refetch: refetchPaymentsStats,
    isRefetching: refetchingPaymentsStats,
    isError: errorPaymentsStats,
  } = useQuery({
    queryKey: [`dashboard-payments-stats`],
    queryFn: getPaymentsFn,
  });

  useEffect(() => {
    refetchPaymentsStats();
  }, [value]);

  function getCurrentMonthName() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthIndex = new Date().getMonth(); // getMonth() returns 0-11
    return months[currentMonthIndex];
  }

  return (
    <div>
      <div className="p-2  ">
        <div className="mb-3">
          <h2 className="text-lg font-bold mb-4">Overview</h2>
          {loadingOrdersStats ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton height={140} />
              <Skeleton height={140} />
              <Skeleton height={140} />
              <Skeleton height={140} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-light p-4 rounded-lg shadow border border-brown-500">
                <h3 className="text-lg font-semibold">Classes</h3>
                <p className="text-2xl">
                  {ordersStatsData?.data?.totalClasses}
                </p>
                <Link
                  to={"/dashboard/orders/classes"}
                  className=" italic text-blue-500 text-sm "
                >
                  Manage classes{" "}
                </Link>
              </div>
              <div className="bg-light p-4 rounded-lg shadow border border-green-500">
                <h3 className="text-lg font-semibold">Exams</h3>
                <p className="text-2xl">{ordersStatsData?.data?.totalExams}</p>
                <Link
                  to={"/dashboard/orders/exams"}
                  className=" italic text-blue-500 text-sm "
                >
                  Manage exams{" "}
                </Link>
              </div>
              <div className="bg-light p-4 rounded-lg shadow border border-blue-500">
                <h3 className="text-lg font-semibold">Assignments</h3>
                <p className="text-2xl">
                  {ordersStatsData?.data?.totalAssignments}
                </p>
                <Link
                  to={"/dashboard/orders/assignments"}
                  className=" italic text-blue-500 text-sm "
                >
                  Manage assignments{" "}
                </Link>
              </div>
              <div className="bg-light p-4 rounded-lg shadow border border-cyan-500 ">
                <h3 className="text-lg font-semibold">Test Papers</h3>
                <p className="text-2xl">
                  {ordersStatsData?.data?.totalTestPapers}
                </p>
                <Link
                  to={"/dashboard/all-papers"}
                  className=" italic text-blue-500 text-sm "
                >
                  Manage practice tests{" "}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div
          className={` ${auth?.roles?.includes("Manager") && "hidden"} mb-2`}
        >
          <h2 className="text-lg font-bold mb-1">Payment Overview</h2>
          <div className="bg-light px-2 py-4 flex gap-5 mb-3 ">
            <p> Payments for: </p>
            <div className="">
              <MonthPickerInput
                placeholder="Pick month"
                value={value}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton visible={loadingPaymentStats || refetchingPaymentsStats}>
              <div className="bg-light p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Orders</h3>
                <div className="bg-gray-50 w-full px-2  ">
                  <table className="w-full  ">
                    <tr className="border-b-2">
                      <td className="font-bold">Total:</td>
                      <td className="font-bold  ">
                        ${paymentStatsData?.data?.totalAmountPaid?.toFixed(2)}
                      </td>
                    </tr>

                    <tr className="">
                      <td>Exams:</td>
                      <td className="font-bold  ">
                        ${paymentStatsData?.data?.examsTotal?.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="">
                      <td>Classes:</td>
                      <td className="font-bold  ">
                        ${paymentStatsData?.data?.classesTotal?.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="">
                      <td>Essay:</td>
                      <td className="font-bold  ">
                        ${paymentStatsData?.data?.essaysTotal?.toFixed(2)}
                      </td>
                    </tr>
                  </table>
                </div>
                {/* <Link className="text-blue-500 underline underline-offset-4 ">
                  View Balances
                </Link> */}
              </div>
            </Skeleton>
            <div>
              <Skeleton
                visible={loadingPaymentStats || refetchingPaymentsStats}
              >
                <div className="bg-light p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">
                    {getCurrentMonthName()} Subscriptions
                  </h3>
                  <p>
                    Total:{" "}
                    <span className="font-bold">
                      $
                      {paymentStatsData?.data?.totalSubscriptionAmount?.toFixed(
                        2
                      )}
                    </span>
                  </p>
                  <Link
                    to={"/dashboard/client-subscription"}
                    className="text-primary cursor-pointer"
                  >
                    View all subscription plans
                  </Link>
                </div>
              </Skeleton>

              <div className="mt-4 bg-light p-2">
                <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                <div className="flex flex-wrap gap-3 space-x-4 bg-light px-2">
                  <Link
                    to={"/dashboard/add-paper"}
                    className="border border-tertiary text-dark bg-tertiary bg-opacity-100 hover:bg-opacity-40 p-2 rounded-lg"
                  >
                    Add Test Paper
                  </Link>
                  <Link
                    to={"/dashboard/users"}
                    className="border border-tertiary text-dark bg-tertiary bg-opacity-100 hover:bg-opacity-40 p-2 rounded-lg"
                  >
                    Manage Managers & Writers
                  </Link>
                  <Link
                    to={"/dashboard/subscriptions"}
                    className="border border-tertiary text-dark bg-tertiary bg-opacity-100 hover:bg-opacity-40 p-2 rounded-lg"
                  >
                    Manage Subscriptions
                  </Link>
                  <Link
                    to={"/dashboard/clients"}
                    className="border border-tertiary text-dark bg-tertiary bg-opacity-100 hover:bg-opacity-40 p-2 rounded-lg"
                  >
                    View Clients
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <SubscriptionGraph />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
