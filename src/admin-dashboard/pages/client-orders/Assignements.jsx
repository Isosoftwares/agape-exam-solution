import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mantine/core";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import formatDateTime from "../../../utils/formatDateandTime";

function Assignements({ clientId }) {
  const axios = useAxiosPrivate();
  const [perPage, setPerPage] = useState(8);
  const [activePage, setPage] = useState(1);
  const [status, setStatus] = useState("");

  // get assignments types
  const getClientOrders = async () => {
    return await axios.get(
      `/assignments?page=${activePage}&perPage=${perPage}&status=${status}&clientId=${clientId}`
    );
  };

  const {
    isLoading: loadingAssignments,
    data: assignmentsData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`assignments-orders-${clientId}`],
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(assignmentsData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, status]);
  return (
    <div>
      <p className="font-bold  ">Assignment Orders </p>

      {/* table */}
      <div className="">
        {/* table */}
        <div className="overflow-x-auto overflow-y-auto  relative shadow-sm sm:rounded-md bg-white border  ">
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
                  Title
                </th>

                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Size
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Due Date
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
              {loadingAssignments || refetchingOrders ? (
                <tr>
                  <td colSpan={8} className="text-center pl-[50%] py-4">
                    <LoadingSpinner size={30} />
                  </td>
                </tr>
              ) : assignmentsData?.data?.message ? (
                <tr>
                  <td colSpan={5} className="text-gray-800 text-center py-3  ">
                    <p>{assignmentsData?.data?.message}</p>
                  </td>
                </tr>
              ) : (
                assignmentsData?.data?.assignments?.map((item, index) => {
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
                          to={`/dashboard/orders/assignments/${item?._id}`}
                        >
                          {item?.title}
                        </Link>
                      </td>

                      <td className={`  py-2 px-1 text- text-center`}>
                        {item?.workSize}  {item?.workSizeType}
                      </td>
                      <td className={`  py-2 px-1 text- text-center`}>
                        {formatDateTime(item?.dueDate)}
                      </td>

                      <td className={`  py-2 px-1 text- text-center  `}>
                        <span className="bg-tertiary py-1 px-3 rounded-xl">
                          {item?.status}
                        </span>
                      </td>
                      <td className={`font-bold py-2 px-1 text- text-center`}>
                        ${item?.amount?.toFixed(2)}
                      </td>

                      <td className="py-2 px-1 flex gap-2 font-bold items-center ">
                        <Link
                          to={`/dashboard/orders/assignments/${item?._id}`}
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
          <div className="my-4 flex flex-row flex-wrap gap-4 items-center bg-light py-2 px-1 border-t">
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
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={30}>30</option>
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

export default Assignements;
