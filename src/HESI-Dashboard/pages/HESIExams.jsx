import React, { useEffect, useState } from "react";
import { Loader, Pagination } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import TestCard from "../../client-dashboard/components/TestCard";
import subjects from "../../utils/subjects";
import PremiumCTA2 from "../../client-dashboard/components/PremiumCTA2";

function HESIExams() {
  const { tag } = useParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [examType, setExamType] = useState("HESI");
  const [subscription, setSubscription] = useState("Premium");
  const axios = useAxiosPrivate();
  const getPapers = () => {
    return axios.get(
      `/test-paper?page=${activePage}&perPage=${perPage}&examType=${examType}&subscriptionType=${subscription}&subject=${selectedSubject}&tag=${tag}`
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
      `hesi-papers--`,
      selectedSubject,
      activePage,
      perPage,
      examType,
      subscription,
    ],
    queryFn: getPapers,
  });

  const totalPages = Math.ceil(papersData?.data?.count / perPage);

  useEffect(() => {
    refetchPapers();
  }, [
    selectedSubject,
    perPage,
    activePage,
    examType,
    subscription,
    tag,
    refetchPapers,
  ]);
  useEffect(() => {
    setSelectedSubject('');
  }, [tag]);

  return (
    <div>
      <div className="bg-light mt-5 ">
        <div className="py-4 px-3">
          <h1 className="text-primary text-xl font-bold leading-tight mb-3 capitalize">
            HESI{" "}
            <span className="text-secondary text-xl font-bold leading-tight">
              {subscription}
            </span>{" "}
            Practice Tests {subscription === "Premium" && "With Pass Guarantee"}
          </h1>
          <div className="">
            <p className="text- font-bold">
              For help with your exam chat with us and learn more about our
              services
            </p>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="bg-light px-2 flex flex-row flex-wrap gap-4 py-6 ">
        <div
          className={`${
            selectedSubject === ""
              ? "bg-secondary text-light"
              : "bg-gray-100 text-gray-900 "
          }   border border-secondary px-5 py-1 rounded-md  `}
          onClick={() => {
            setSelectedSubject("");
          }}
        >
          <p>{"All"}</p>
        </div>
        {subjects()?.HESI?.map((item, index) => {
          return (
            <div
              key={index}
              className={`${
                selectedSubject === item
                  ? "bg-secondary text-light"
                  : "bg-gray-100 text-gray-900 "
              }   border border-secondary px-5 py-1 rounded-md  `}
              onClick={() => {
                setSelectedSubject(item);
              }}
            >
              <p>{item}</p>
            </div>
          );
        })}
      </div>

      {/* papers */}
      <div>
        {/* the papers */}
        <div className="mt-3 ">
          {loadingPapers || refetchingPapers ? (
            <div className="text-center flex justify-center py-5">
              <Loader color="blue" size={25} />
            </div>
          ) : papersData?.data?.message ? (
            <div className="text-center flex justify-center py-5 bg-light italic">
              <p>{papersData?.data?.message}!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 md:space-y-0">
              {papersData?.data?.testPapers?.map((item, index) => (
                <div key={index}>
                  <TestCard paper={item} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="my-4 flex flex-row flex-wrap gap-4 items-center">
          <Pagination
            total={totalPages || 0}
            page={activePage}
            color="#002159"
            onChange={setPage}
          />
          <div
            className={`flex items-center ${
              !papersData?.data?.testPapers?.length && "hidden"
            }`}
          >
            <p>
              Showing{" "}
              <select
                className="px-4 py-1 rounded-md mx-1"
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

        <PremiumCTA2 serviceName={'HESI'}/>
      </div>
    </div>
  );
}

export default HESIExams;
