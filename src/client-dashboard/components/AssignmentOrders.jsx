import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import emp from "../../assets/graphics/emp.jpg";
import { Link } from "react-router-dom";
import AssignmentOrderCard from "./order-cards/AssignmentOrderCard";

function AssignmentOrders() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [perPage, setPerPage] = useState(3);
  const [activePage, setPage] = useState(1);
  const [clientId, setClientId] = useState(auth?.userId);
  const [status, setStatus] = useState("");

  // get class types
  const getClientOrders = async () => {
    return await axios.get(
      `/assignments?page=${activePage}&perPage=${perPage}&clientId=${clientId}&status=${status}`
    );
  };

  const {
    isLoading: loadingAssignments,
    data: assignmentsData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`assignments-orders`],
    keepPreviousData: true,
  });
  const totalPages = Math.ceil(assignmentsData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, status]);

  return (
    <div>
      <h1 className="font-bold text-lx underline underline-offset-4 ">
        Assignment/ Essay orders
      </h1>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between mt-2">
        {/* orders */}
        <div className="w-full lg:basis-3/4 ">
          {loadingAssignments || refetchingOrders ? (
            <div className="flex justify-center items-center rounded-md shadow-sm border-2 shadow-cyan-50 bg-light  min-h-[200px]">
              <div className="flex gap-1 justify-center items-center">
                <span className="primary">Getting your orders...</span>
                <Loader color="blue" size={20} />
              </div>
            </div>
          ) : assignmentsData?.data?.message ? (
            <div className="flex flex-col justify-center bg-light min-h-[200px] rounded-md shadow-sm border-2 shadow-cyan-50">
              <p className="text-center ">{assignmentsData?.data?.message}</p>
              <Link
                className="text-blue-500 text-center  "
                to={"/client/create-order"}
              >
                Create order
              </Link>
            </div>
          ) : (
            <div>
              {assignmentsData?.data?.assignments?.map((item, index) => {
                return (
                  <div key={index}>
                    <AssignmentOrderCard order={item} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="my-4 flex flex-row flex-wrap gap-4 items-center bg-light py-2 px-1">
            <Pagination
              total={totalPages || 0}
              page={activePage}
              color="#002159"
              onChange={setPage}
            />
            <div className="flex items-center ">
              <p className="">
                Showing{" "}
                <select
                  id=""
                  className="px-4 py-1 rounded-md mx-1 "
                  onChange={(e) => {
                    setPerPage(e.target.value);
                    setPage(1);
                  }}
                  value={perPage}
                >
                  <option value={5}>5</option>
                  <option value={10}>7</option>
                  <option value={15}>10</option>
                </select>
                items per page
              </p>
            </div>
          </div>
        </div>

        {/* filters */}
        <div className=" w-full lg:basis-1/4   ">
          <div className="bg-light shadow-cyan-50 min-h-[300px] px-2 rounded-md shadow-sm border ">
            <p className="font-bold py-2  ">Filters</p>
            <div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">Status</label>
                <select
                  name=""
                  id=""
                  className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="">All Orders</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Progress">Progress</option>
                  <option value="Completed">completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* <div className="flex flex-col gap-1">
                <label htmlFor="">Date</label>
                <input
                  type="date"
                  className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentOrders;
