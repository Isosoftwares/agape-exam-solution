import { Modal, Pagination } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function MyTeasTests() {
  const axios = useAxiosPrivate();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [status, setStatus] = useState("Active");
  const [examType, setExamType] = useState("TEAS");

  const { auth } = useAuth();

  const getExams = () => {
    return axios.get(
      `/test-paper/submitted?page=${activePage}&perPage=${perPage}&clientId=${auth?.userId}&examType=${examType}`
    );
  };

  const {
    isLoading: loadingExams,
    data: examData,
    refetch,
    isRefetching: refetchingExams,
  } = useQuery({
    queryKey: [`teas-tests`],
    queryFn: getExams,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(examData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, status, examType]);

  //end of fetching products------------------

  return (
    <div>
      <div className="bg-light">
        <div className="py-4 px-3">
          <h1 className="text-primary text-xl font-bold leading-tight mb-3 capitalize">
            TEAS Test Results
          </h1>
        </div>
      </div>

      {/* table */}
      <div>
        <div className="mb- pb-2 mt-3 ">
          {/* table */}
          <div className="overflow-x-auto overflow-y-auto  relative shadow-sm sm:rounded-md bg-white  ">
            <table className="w-full text-sm text-left   ">
              <thead
                className={`text-xs text-gray-700 bg-[#f0eded] bg-opacity-30 border-b`}
              >
                <tr>
                  <th
                    scope="col"
                    className="py-[8px] text-start px-3  text-gray-900 whitespace-nowrap"
                  >
                    #
                  </th>

                  <th scope="col" className="py-[2px] text-start px-2 text-sm">
                    Topic/ Name
                  </th>

                  <th scope="col" className="py-[2px] text-center px-2 text-sm">
                    Score
                  </th>

                  <th scope="col" className="py-[2px] text-center px-2 text-sm">
                    Questions
                  </th>
                  <th scope="col" className="py-[2px] text-start px-2 text-sm">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {loadingExams || refetchingExams ? (
                  <tr>
                    <td colSpan={8} className="text-center pl-[50%] py-4">
                      <LoadingSpinner size={30} />
                    </td>
                  </tr>
                ) : examData?.data?.message ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-gray-800 text-center py-3  "
                    >
                      <p>{examData?.data?.message}</p>
                    </td>
                  </tr>
                ) : (
                  examData?.data?.testPapers?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50 odd:bg-[#fcfcfc] "
                      >
                        <td className=" px-4 text-lg text-start py-3">
                          {index + 1}
                        </td>

                        <td className={`  py-2 px-1 text- text-start`}>
                          {item?.testPaperId?.name}
                        </td>

                        <td
                          className={`  py-2 px-1 text-center font-bold text- `}
                        >
                          {((item?.correctAnswerScore /
                            item?.questions?.length) *
                            100)?.toFixed(2)}
                          %
                        </td>

                        <td className={`  py-2 px-1 text- text-center`}>
                          {item?.questions?.length}
                        </td>

                        <td className="py-2 px-1 flex gap-2 font-bold items-center ">
                          <Link
                            to={`/teas/review-test/${item?._id}`}
                            state={item}
                          >
                            <span className="px-2 py-1 bg-secondary text-[#f3f3f3] rounded-md hover:scale-105 cursor-pointer ">
                              Review
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="py-3 px-3 flex justify-start ">
              <Pagination
                total={totalPages || 0}
                page={activePage}
                color="blue"
                onChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTeasTests;
