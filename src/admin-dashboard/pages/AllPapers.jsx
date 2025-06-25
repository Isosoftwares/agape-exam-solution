import React, { useEffect, useState } from "react";
import { Pagination } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import subjects from "../../utils/subjects";

function AllPapers() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [examType, setExamType] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [tag, setTag] = useState("");

  const axios = useAxiosPrivate();
  const getPapers = () => {
    return axios.get(
      `/test-paper?page=${activePage}&perPage=${perPage}&examType=${examType}&subscriptionType=${subscriptionType}&subject=${selectedSubject}&tag=${tag}`
    );
  };

  const {
    isLoading: loadingPapers,
    data: papersData,
    refetch: refetchPapers,
    isRefetching: refetchingPapers,
    isError: errorGettingPapers,
    error,
  } = useQuery({
    queryKey: [
      `all-papers--`,
      selectedSubject,
      activePage,
      perPage,
      examType,
      subscriptionType,
    ],
    queryFn: getPapers,
  });

  const totalPages = Math.ceil(papersData?.data?.count / perPage);

  useEffect(() => {
    refetchPapers();
  }, [perPage, activePage, examType, subscriptionType, selectedSubject, tag]);

  const handeResetFilter = () => {
    setExamType("");
    setSubscriptionType("");
    setSelectedSubject("");
    setPage(1);
  };

  const subjectss = (exam) => {
    if (exam === "TEAS") {
      return subjects()?.TEAS;
    } else if (exam === "GED") {
      return subjects()?.GED;
    } else if (exam === "HESI") {
      return subjects()?.HESI;
    } else {
      return [];
    }
  };

  return (
    <div>
      <p className="font-bold text-lg ">Practice Test papers </p>
      {/* filters */}
      <div className="bg-light py-4 px-2 rounded  ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="">Subscription</label>
            <select
              className="w-full p-[5px] py-2 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
              onChange={(e) => {
                const value = e.target.value;
                if (value === "All") {
                  setSubscriptionType(""); // Set subscription type to empty string
                } else {
                  setSubscriptionType(value); // Set subscription type to selected value
                }
                setPage(1); // Reset the page to 1
              }}
              value={subscriptionType}
            >
              <option value="All">All</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Tag</label>
            <select
              className="w-full p-[5px] py-2 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
              onChange={(e) => {
                const value = e.target.value;
                if (value === "All") {
                  setTag(""); // Set subscription type to empty string
                } else {
                  setTag(value); // Set subscription type to selected value
                }
                setPage(1); // Reset the page to 1
              }}
              value={tag}
            >
              <option value="All">All</option>
              <option value="Priority Premium Test">
                Priority Premium Test
              </option>
              <option value="Bonus Practice Test">Bonus Practice Test</option>
            </select>
          </div>

          <div>
            <label htmlFor="">Test Type</label>
            <select
              className="w-full p-[5px] py-2 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
              onChange={(e) => {
                const value = e.target.value;
                if (value === "All") {
                  setExamType("");
                } else {
                  setExamType(value);
                }
                setPage(1); // Reset the page to 1
              }}
              value={examType}
            >
              <option value="All">All</option>
              <option value="HESI">HESI</option>
              <option value="TEAS">TEAS</option>
              <option value="GED">GED</option>
            </select>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-md font-medium text-gray-700">
              Subject{" "}
            </label>
            <select
              className="w-full p-[5px] py-2 focus:border-1 outline-none rounded-md focus:border-blue-300 border-2  bg-light "
              onChange={(e) => {
                const value = e.target.value;
                if (value === "All") {
                  setSelectedSubject("");
                } else {
                  setSelectedSubject(value);
                }
                setPage(1); // Reset the page to 1
              }}
              value={selectedSubject}
            >
              <option value="All">All subject...</option>
              {subjectss(examType)?.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p>{papersData?.data?.count || 0} Result</p>
          <button
            className="bg-primary text-light px-2 py-1 rounded hover:bg-opacity-80 "
            onClick={() => {
              handeResetFilter();
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* table */}
      <div className="mb- pb-2 mt-3 ">
        {/* table */}
        <div className="overflow-x-auto overflow-y-auto  relative shadow-sm sm:rounded-md bg-white  ">
          <table className="w-full text-md text-left table-auto   ">
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
                  Name
                </th>
                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Test/Exam Type
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Subscription Type
                </th>
                <th scope="col" className="py-[2px] text-center px-2 text-md">
                  Tag
                </th>
                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  No Of Questions
                </th>

                <th scope="col" className="py-[2px] text-start px-2 text-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {loadingPapers || refetchingPapers ? (
                <tr>
                  <td colSpan={8} className="text-center pl-[50%] py-4">
                    <LoadingSpinner size={30} />
                  </td>
                </tr>
              ) : papersData?.data?.message ? (
                <tr>
                  <td colSpan={5} className="text-gray-800 text-center py-3  ">
                    <p>{papersData?.data?.message}</p>
                  </td>
                </tr>
              ) : (
                papersData?.data?.testPapers?.map((item, index) => {
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
                          to={`/dashboard/all-papers/${item?._id}`}
                        >
                          {item?.name}
                        </Link>
                      </td>

                      <td
                        className={`  py-2 px-1 text-center font-bold capitalize`}
                      >
                        {item?.examType}
                      </td>
                      <td className={`  py-2 px-1 text- text-center  `}>
                        <span
                          className={`${
                            item?.subscriptionType === "Free"
                              ? "bg-tertiary"
                              : "bg-primary text-light "
                          }  py-1 px-3 rounded-xl`}
                        >
                          {item?.subscriptionType}
                        </span>
                      </td>

                      <td className={`  py-2 px-1 text- text-center`}>
                        {item?.tag}
                      </td>
                      <td className={`  py-2 px-1 text- text-center`}>
                        {item?.noOfQuestions}
                      </td>

                      <td className="py-2 px-1 flex gap-2 font-bold items-center ">
                        <Link
                          to={`/dashboard/all-papers/${item?._id}`}
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
  );
}

export default AllPapers;
