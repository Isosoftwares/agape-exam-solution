import React from "react";
import useAuth from "../../hooks/useAuth";
import { MdArrowRightAlt } from "react-icons/md";
import { Divider, Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
function OverView() {
  const { auth } = useAuth();

  const axios = useAxiosPrivate();
  const getOrdersStats = () => {
    return axios.get(`/dashboard/client/${auth?.userId}`);
  };

  const {
    isLoading: loadingOrdersStats,
    data: ordersStatsData,
    refetch: refetchOrderStats,
    isRefetching: refetchingOrdersStats,
    isError: errorOrdersStats,
    error,
  } = useQuery({
    queryKey: [`dashboard-client-orders-stats`],
    queryFn: getOrdersStats,
  });

  return (
    <div>
      <div className="md:p-6 ">
        <div className="mb-5 border-b-2 pb-2 ">
          <h1 className="text-2xl font-bold capitalize">
            Hello {auth?.userName}, Welcome back!
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row  mb-6 gap-2">
          <div className="flex-1 p-4   text-card-foreground rounded-lg shadow-sm bg-light ">
            <h2 className="text-lg font-semibold mb-2">My Orders</h2>
            <Divider />
            <Skeleton className="my-2" visible={loadingOrdersStats}>
              <div className="flex  gap-6 my-4 py-4 items-center ">
                <div className="flex items-center bg-[#fafdfd] border rounded-md shadow overflow-hidden ">
                  <div className="px-4 text-gray-900">
                    <h3 className="text- tracking-wider text-center ">
                      Classes
                    </h3>
                    <p className="text-3xl text-center ">
                      {ordersStatsData?.data?.totalClasses}
                    </p>
                  </div>
                </div>
                <div className="flex  items-center bg-[#fafdfd] border rounded-md shadow overflow-hidden ">
                  <div className="px-4 text-gray-900">
                    <h3 className="text- tracking-wider text-center ">Exams</h3>
                    <p className="text-3xl text-center ">
                      {ordersStatsData?.data?.totalExams}
                    </p>
                  </div>
                </div>
                <div className="flex  items-center bg-[#fafdfd] border rounded-md shadow overflow-hidden ">
                  <div className="px-4 text-gray-900">
                    <h3 className="text- tracking-wider text-center ">
                      Assignments
                    </h3>
                    <p className="text-3xl text-center ">
                      {ordersStatsData?.data?.totalAssignments}
                    </p>
                  </div>
                </div>
              </div>
            </Skeleton>
            <div className="flex w-full">
              <div>
                <Link
                  to={"/client/create-order"}
                  className="bg-tertiary mx-2 text-gray-900 py-2 px-4 rounded "
                >
                  Place Order
                </Link>
              </div>
              <div>
                <Link
                  to={"/client/my-orders"}
                  className="border-primary  border mx-2 text-primary-foreground py-2 px-4 rounded "
                >
                  <span>View All Order</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 bg-card text-card-foreground rounded-lg shadow-sm bg-light ">
            <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
            <Divider />
            <p className="mb-4 font-bold text-lg">
              Balance: ${auth?.balance?.toFixed(2) || 0}
            </p>
            <div className="flex gap-3 mt-10 ">
              <div>
                <Link
                  to={"/client/wallet"}
                  className="bg-primary  text-light py-3 px-4  rounded hover:bg-secondary/20 hover:text-dark"
                >
                  View Wallet
                </Link>
              </div>
              <div>
                <Link
                  to={"/client/wallet"}
                  className="bg-tertiary text-secondary-foreground py-4 px-4 rounded hover:bg-secondary/20"
                >
                  View Subscriptions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="p-4 bg-card text-card-foreground rounded-lg shadow-sm bg-light ">
          <p className="mb-4 text-primary text-center text-2xl font-bold capitalize">
            Practice for your next test with our premium practice tests.
          </p>
          <div className="flex flex-col items-center justify-center">
            <p>Practice for your next HESI, GED, and TEAS exams</p>
            <p className="text-center w-[70%] ">
              Our exam-like practice tests are designed to mirror the actual
              exams. With our pass guarantee, you can be confident that our
              resources will help you succeed. Walk into the exam room with
              confidence!
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-6">
            <Link
              to={"/teas"}
              target="_blank"
              className="bg-dark text-light py-1 px-4 rounded hover:bg-accent/80"
            >
              TEAS Practice Test
            </Link>
            <Link
              target="_blank"
              to={"/ged"}
              className="bg-dark text-light py-1 px-4 rounded hover:bg-accent/80"
            >
              GED Practice Test
            </Link>
            <Link
              to={"/hesi"}
              target="_blank"
              className="bg-dark text-light py-1 px-4 rounded hover:bg-accent/80"
            >
              HESI Practice Test
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default OverView;
