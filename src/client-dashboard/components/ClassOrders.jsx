import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import emp from "../../assets/graphics/emp.jpg";
import { Link } from "react-router-dom";
import ClassOrderCard from "./order-cards/ClassOrderCard";

function ClassOrders() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [clientId, setClientId] = useState(auth?.userId);
  const [status, setStatus] = useState("");

  // get class types
  const getClientOrders = async () => {
    return await axios.get(
      `/classes?page=${activePage}&perPage=${perPage}&clientId=${clientId}&status=${status}`
    );
  };

  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`class-orders`],
    keepPreviousData: true,
  });
  const totalPages = Math.ceil(classesData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, status]);
  return (
    <div>
      <h1 className="font-bold text-lx underline underline-offset-4 ">
        Class orders
      </h1>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between mt-2">
        {/* orders */}
        <div className="w-full lg:basis-3/4 ">
          {loadingClasses || refetchingOrders ? (
            <div className="flex justify-center items-center rounded-md shadow-sm border-2 shadow-cyan-50 bg-light  min-h-[200px]">
              <div className="flex gap-1 justify-center items-center">
                <span className="primary">Getting your orders...</span>
                <Loader color="blue" size={20} />
              </div>
            </div>
          ) : classesData?.data?.message ? (
            <div className="flex flex-col justify-center bg-light min-h-[200px] rounded-md shadow-sm border-2 shadow-cyan-50">
              <p className="text-center ">{classesData?.data?.message}</p>
              <Link
                className="text-blue-500 text-center  "
                to={"/client/create-order"}
              >
                Create order
              </Link>
            </div>
          ) : (
            <div>
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

                        <th
                          scope="col"
                          className="py-[2px] text-start px-2 text-md"
                        >
                          Class Type
                        </th>
                        <th
                          scope="col"
                          className="py-[2px] text-start px-2 text-md"
                        >
                          Class NO
                        </th>

                        <th
                          scope="col"
                          className="py-[2px] text-center px-2 text-md"
                        >
                          Courses
                        </th>
                        <th
                          scope="col"
                          className="py-[2px] text-center px-2 text-md"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="py-[2px] text-center px-2 text-md"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="py-[2px] text-start px-2 text-md"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {loadingClasses || refetchingOrders ? (
                        <tr>
                          <td colSpan={8} className="text-center pl-[50%] py-4">
                            <LoadingSpinner size={30} />
                          </td>
                        </tr>
                      ) : classesData?.data?.message ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-gray-800 text-center py-3  "
                          >
                            <p>{classesData?.data?.message}</p>
                          </td>
                        </tr>
                      ) : (
                        classesData?.data?.classes?.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="bg-white border-b hover:bg-gray-50 odd:bg-[#fcfcfc] "
                            >
                              <td className=" px-4 text-lg text-start py-3">
                                {index + 1}
                              </td>

                              <td className={`  py-2 px-1 text- text-start`}>
                                <Link
                                  className="text-secondary"
                                  to={`/client/my-orders/class/${item?._id}`}
                                >
                                  {item?.classType}
                                </Link>
                              </td>
                              <td className=" px-4  text-lg text-start py-3">
                                #{item?.classNo}
                              </td>

                              <td className={`  py-2 px-1 text- text-center`}>
                                {item?.courses?.length}
                              </td>
                              <td className={`  py-2 px-1 text- text-center  `}>
                                <span className="bg-tertiary py-1 px-3 rounded-xl">
                                  {item?.status}
                                </span>
                              </td>
                              <td
                                className={`font-bold py-2 px-1 text- text-center`}
                              >
                                ${item?.amount}
                              </td>

                              <td className="py-2 px-1 flex gap-2 font-bold items-center ">
                                <Link
                                  to={`/client/my-orders/class/${item?._id}`}
                                  state={item}
                                >
                                  <span className="px-2 py-1 bg-primary text-[#f3f3f3] rounded-md hover:scale-105 cursor-pointer ">
                                    View
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
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
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={50}>50</option>
                        </select>
                        items per page
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* filters */}
        <div className="bg-light w-full lg:basis-1/4 px-2 rounded-md shadow-sm border-2 shadow-cyan-50 min-h-[300px] ">
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
  );
}

export default ClassOrders;
