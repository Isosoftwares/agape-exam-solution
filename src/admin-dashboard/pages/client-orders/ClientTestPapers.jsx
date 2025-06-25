import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Divider, Pagination, RingProgress } from "@mantine/core";
import formatDateandTime from "../../../utils/formatDateandTime";

function ClientTestPapers({ clientId }) {
  const axios = useAxiosPrivate();
  const [perPage, setPerPage] = useState(4);
  const [activePage, setPage] = useState(1);
  const [examType, setExamType] = useState("");

  const getExams = () => {
    return axios.get(
      `/test-paper/submitted?page=${activePage}&perPage=${perPage}&examType=${examType}&clientId=${clientId}`
    );
  };

  const {
    isLoading: loadingExams,
    data: examData,
    refetch,
    isRefetching: refetchingExams,
  } = useQuery({
    queryKey: [`attempts-tests-${clientId}`],
    queryFn: getExams,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(examData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, examType]);

  function getColorBasedOnScore(score) {
    if (score === 0) {
      return "red";
    } else if (score < 70) {
      return "red";
    } else {
      return "green";
    }
  }

  const examsTypes = ["HESI", "GED", "TEAS"];
  return (
    <div>
      <div className="bg-light px-2 flex flex-row flex-wrap gap-4 py-2 ">
        <div
          className={`${
            examType === ""
              ? "bg-primary text-light"
              : "bg-gray-100 text-gray-900 "
          }   border border-primary px-5  rounded-md  `}
          onClick={() => {
            setExamType("");
          }}
        >
          <p>{"All"}</p>
        </div>
        {examsTypes?.map((item, index) => {
          return (
            <div
              key={index}
              className={`${
                examType === item
                  ? "bg-primary text-light"
                  : "bg-gray-100 text-gray-900 "
              }   border border-primary px-5  rounded-md  `}
              onClick={() => {
                setExamType(item);
              }}
            >
              <p>{item}</p>
            </div>
          );
        })}
      </div>
      <div className=" ">
        {loadingExams || refetchingExams ? (
          <div
            colSpan={8}
            className="text-center flex items-center justify-center py-4 bg-light "
          >
            <p>Getting papers...</p>
            <LoadingSpinner size={30} />
          </div>
        ) : examData?.data?.message ? (
          <div className="text-gray-800 bg-light  text-center py-3 ">
            <p>{"No papers done!"}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {examData?.data?.testPapers?.map((item, index) => {
              return (
                <div key={index} className="bg-light my-2 px-3 rounded-md ">
                  <p className="font-bold  border-b  ">
                    {item?.testPaperId?.name}
                  </p>
                  <Divider />
                  <div className="flex flex-col md:flex-row gap-4 pb-2 mt-2 ">
                    <div className="flex flex-col justify-center items-center">
                      {!(
                        (item?.correctAnswerScore / item?.questions?.length) *
                        100
                      ) ? (
                        <RingProgress
                          size={120}
                          label={
                            <p className="text-center font-bold">
                              Score{" "}
                              {(
                                (item?.correctAnswerScore /
                                  item?.questions?.length) *
                                100
                              )?.toFixed(1)}
                              %
                            </p>
                          }
                          sections={[
                            {
                              value: 100,
                              color: getColorBasedOnScore(
                                (item?.correctAnswerScore /
                                  item?.questions?.length) *
                                  100
                              ),
                            },
                          ]}
                        />
                      ) : (
                        <RingProgress
                          size={120}
                          label={
                            <p className="text-center font-bold">
                              Score{" "}
                              {(
                                (item?.correctAnswerScore /
                                  item?.questions?.length) *
                                100
                              )?.toFixed(1)}
                              %
                            </p>
                          }
                          sections={[
                            {
                              value:
                                (item?.correctAnswerScore /
                                  item?.questions?.length) *
                                100,
                              color: getColorBasedOnScore(
                                (item?.correctAnswerScore /
                                  item?.questions?.length) *
                                  100
                              ),
                            },
                          ]}
                        />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="flex flex-col gap-2  pr-3">
                        <div className="border px-4 py-3 rounded-md ">
                          <p className="font-bold text- ">
                            Exam: {item?.examType}
                          </p>
                          <p className="font-bold text- ">
                            {item?.questions?.length} Questions
                          </p>
                          <p className="font-bold text- ">
                            {item?.correctAnswerScore} Correct answer(s)
                          </p>
                          <p className="font-bold text- ">
                            Done On: {formatDateandTime(item?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            items per page
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientTestPapers;
