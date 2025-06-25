import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Pagination } from "@mantine/core";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import formatDateandTime from "../../utils/formatDateandTime";
import ReactSelect from "react-select";

function ExamOrders() {
  const axios = useAxiosPrivate();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [assignedWriter, setAssignedWriter] = useState("");

  // get exams
  const getClientOrders = async () => {
    return await axios.get(
      `/exams?page=${activePage}&perPage=${perPage}&status=${status}&assignedWriter=${assignedWriter}`
    );
  };

  const {
    isLoading: loadingExams,
    data: examsData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`exam-orders`],
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(examsData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, status, assignedWriter]);

  // get writers
  const getAllWriters = () => {
    return axios.get(`/user?role=${"Writer"}&isPaginated=${false}`);
  };

  const { isLoading: loadingWriters, data: writersData } = useQuery({
    queryKey: [`allWriters-add-class`],
    queryFn: getAllWriters,
    keepPreviousData: true,
  });

  let writers =
    writersData?.data?.users?.map((writer) => {
      const container = {};
      container.label = writer?.userName;
      container.value = writer?._id;
      return container;
    }) || [];

  const ResetFilters = () => {
    setStatus("");
    setAssignedWriter("");
  };
  return (
    <div>
      <p className="font-bold text-lg ">Exam Orders </p>
      {/* filters */}
      <div className="bg-light py-4 px-2 rounded  ">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="">Status</label>
            <select
              name=""
              id=""
              className="w-full p-[5px] py-3 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
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
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="block text-sm font-semibold text-gray-600 mb-1"
            >
              Assigned writer
              <span className="text-red-500">
                <sup>*</sup>
              </span>
            </label>
            {loadingWriters ? (
              <div>Loading...</div>
            ) : (
              <ReactSelect
                options={writers}
                value={writers.find(
                  (writer) => writer.value === assignedWriter
                )}
                onChange={(selectedOption) => {
                  setAssignedWriter(selectedOption.value);
                }}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p>{examsData?.data?.count || 0} Result</p>
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
                  Exam Type
                </th>
                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Exam No
                </th>
                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Client
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Exam Date
                </th>

                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Status
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Amount
                </th>
                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {loadingExams || refetchingOrders ? (
                <tr>
                  <td colSpan={8} className="text-center pl-[50%] py-4">
                    <LoadingSpinner size={30} />
                  </td>
                </tr>
              ) : examsData?.data?.message ? (
                <tr>
                  <td colSpan={5} className="text-gray-800 text-center py-3  ">
                    <p>{examsData?.data?.message}</p>
                  </td>
                </tr>
              ) : (
                examsData?.data?.exams?.map((item, index) => {
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
                          to={`/dashboard/orders/exams/${item?._id}`}
                        >
                          {item?.examType}
                        </Link>
                      </td>

                      <td
                        className={`  py-2 px-1 text-start font-bold capitalize`}
                      >
                        #{item?.examNo}
                      </td>
                      <td
                        className={`  py-2 px-1 text-center font-bold capitalize`}
                      >
                        {item?.clientId?.email?.split("@")[0]}
                      </td>

                      <td className={`  py-2 px-1 text- text-center`}>
                        {formatDateandTime(item?.date)}
                      </td>

                      <td className={`  py-2 px-1 text- text-center  `}>
                        <span className="bg-tertiary py-1 px-3 rounded-xl">
                          {item?.status}
                        </span>
                      </td>
                      <td className={`font-bold py-2 px-1 text- text-center`}>
                        ${item?.amount}
                      </td>

                      <td className="py-2 px-1 flex gap-2 font-bold items-center ">
                        <Link
                          to={`/dashboard/orders/exams/${item?._id}`}
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
              <p className="text-sm">
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
  );
}

export default ExamOrders;
