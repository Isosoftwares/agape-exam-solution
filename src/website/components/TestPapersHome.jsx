import React, { useState } from "react";
import PaperCard from "./PaperCard";
import { Link } from "react-router-dom";
import { Loader, Pagination } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function TestPapersHome() {
  const [perPage, setPerPage] = useState(4);
  const [activePage, setPage] = useState(1);
  const [examType, setExamType] = useState("");
  const axios = useAxiosPrivate();

  const getPapers = () => {
    return axios.get(
      `/test-paper?page=${activePage}&perPage=${perPage}&examType=${examType}`
    );
  };

  const {
    isLoading: loadingPapers,
    data: papersData,
    refetch: refetchPappers,
    isRefetching: refetchingpapers,
    isError: errorGetingPapers,
    error,
  } = useQuery({
    queryKey: [`test-papers-home--`],
    queryFn: getPapers,
  });

  return (
    <div>
      <section className="bg-gray-50 px-4 md:px-[100px] ">
        <div className="items-center  px-4 py-8 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-24 lg:px-6">
          <div className="col-span-2 mb-8">
            <p className="text-4xl font-bold capitalize text-primary ">
              Practice test papers
            </p>
            <h2 className="mt-3 mb-4  font-extrabold tracking-tight text-gray-900 md:text-xl dark:text-white">
              Know exactly what to expect on your exam.
            </h2>
            <p className="font-light text-gray-700 sm:text-xl dark:text-gray-400">
              Gain immediate access to over 7,500 exam-like questions designed
              to mimic the content, format, and difficulty of the ATI TEAS©,
              GED, and HESI exams. This ensures you focus on studying what truly
              matters and eliminates surprises on test day.
            </p>
            <div className="pt-6 mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Link
                  to={"/ged-practice-test-papers"}
                  className="inline-flex items-center capitalize text-base font-medium text-primary hover:text-secondary   "
                >
                  Explore over 100 free practice test papers
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </div>
              <div>
                <Link
                  to={"/teas-practice-test-papers"}
                  className="inline-flex capitalize items-center text-base font-medium text-primary hover:text-secondary   "
                >
                  Sign up and Explore premium papers with pass guarantee
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </div>
              <div>
                <Link
                  to={"/signup"}
                  className="bg-primary border border-primary rounded-md text-light px-4 py-2 capitalize shadow-sm hover:text-dark  hover:bg-opacity-0   "
                >
                  Go premium and get full access
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-8">
            <p className="text-primary text-lg font-bold underline underline-offset-4 ">
              Recently added papers
            </p>
            <div className="">
              {loadingPapers ? (
                <div className="flex justify-center items-center">
                  <Loader color="blue" />
                </div>
              ) : papersData?.data?.message ? (
                <div className="flex justify-center items-center">
                  <p>{papersData?.data?.message}</p>
                </div>
              ) : (
                <div className=" grid md:grid-cols-2 gap-3 md:gap-4 md:space-y-0">
                  {papersData?.data?.testPapers?.map((item, index) => {
                    return (
                      <div key={index}>
                        <PaperCard paper={item} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link to={"/ged-practice-test-papers"} className="">
              <p className="text-center text-primary cursor-pointer mt-8 underline underline-offset-4">
                See more papers
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TestPapersHome;
