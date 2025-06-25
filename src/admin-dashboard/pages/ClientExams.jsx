import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Loader, Modal, Pagination } from "@mantine/core";
import formatDateTime from "../../utils/formatDateandTime";
import AddDoMyExamReport from "../components/AddDoMyExamReport";
import { useDisclosure } from "@mantine/hooks";

function ClientExams() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [testType, setTestType] = useState("");
  const [clientId, setClientId] = useState(auth?.userId);
  const [isPaid, setIspaid] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [report, setReport] = useState("");
  const [testId, setTestId] = useState("");

  // get class types
  const getExamsFnc = async () => {
    return await axios.get(
      `/test?page=${activePage}&perPage=${perPage}&testType=${testType}&isPaid=${isPaid}`
    );
  };

  const {
    isLoading: loadingExams,
    data: examsData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getExamsFnc,
    queryKey: [`my-exam-orders-`],
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(examsData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, testType, isPaid]);

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Add Report">
        <AddDoMyExamReport testId={testId} closeModal={close} report={report} />
      </Modal>

      <div>
        <div className="bg-light">
          <div className="py-4 px-3">
            <h1 className="text-primary text-xl font-bold leading-tight mb-3 capitalize">
              Client Exams
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 my-2 pb-3 mx-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Exam Type</label>
              <select
                className="px-2 py-3 rounded-md bg-gray-50  border  "
                name=""
                id=""
                onChange={(e) => {
                  setTestType(e.target.value);
                }}
              >
                <option value="">Select exam type...</option>
                <option value="GED">GED</option>
                <option value="TEAS">TEAS</option>
                <option value="HESI">HESI</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Payment Status</label>
              <select
                className="px-2 py-3 rounded-md bg-gray-50  border  "
                name=""
                id=""
                onChange={(e) => {
                  setIspaid(e.target.value);
                }}
              >
                <option value="">Select exam type</option>
                <option value="yes">Paid </option>
                <option value="no">Not Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* table */}
        <div>
          <div className="mb- pb-2 mt-3 ">
            {/* table */}
            <div className="overflow-x-auto overflow-y-auto  relative   ">
              {loadingExams || refetchingOrders ? (
                <div className="flex justify-center bg-light py-10  ">
                  <Loader size={30} />
                </div>
              ) : examsData?.data?.message ? (
                <div className="bg-light text-center py-10  ">
                  <p className="italic  ">{examsData?.data?.message}</p>
                </div>
              ) : (
                <div>
                  {examsData?.data?.tests?.map((item, index) => {
                    return (
                      <div
                        className="my-2 border rounded-md p-3 bg-light shadow-sm  "
                        key={index}
                      >
                        <p className="font-bold border-b  ">
                          TestNo: {item?.testNo}{" "}
                        </p>
                        <div className="flex flex-col md:flex-row ga-3 ">
                          <div className="w-full">
                            <table>
                              <tr>
                                <td>Exam:</td>
                                <td className="font-bold">{item?.testType}</td>
                              </tr>
                              <tr>
                                <td>Client:</td>
                                <td className="font-bold cursor-pointer text-blue-500 ">
                                  <Link
                                    to={`/dashboard/clients/${item?.clientId?._id}`}
                                    className="font-bold  "
                                  >
                                    {item?.clientId?.email}
                                  </Link>
                                </td>
                              </tr>
                              <tr>
                                <td>Grade:</td>
                                <td className="font-bold">{item?.grade}</td>
                              </tr>
                              <tr>
                                <td>Urgency/Date:</td>
                                <td className="font-bold">
                                  {item?.urgency && item?.urgency}{" "}
                                  {item?.date && formatDateTime(item?.date)}{" "}
                                </td>
                              </tr>
                              <tr>
                                <td>Grade:</td>
                                <td className="font-bold">{item?.grade}</td>
                              </tr>
                              <tr>
                                <td>Status:</td>
                                <td className="font-bold">{item?.status}</td>
                              </tr>
                            </table>
                          </div>
                          <div className="w-full">
                            <table>
                              <tr>
                                <td>Exam Created At:</td>
                                <td className="font-bold">
                                  {formatDateTime(item?.createdAt)}
                                </td>
                              </tr>
                              <tr>
                                <td>Amount:</td>
                                <td className="font-bold">
                                  ${item?.amount?.toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td>Paid Amount:</td>
                                <td className="font-bold">
                                  ${item?.amountPaid?.toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td>Balance:</td>
                                <td className="font-bold">
                                  $
                                  {parseFloat(item?.amount) -
                                    parseFloat(item?.amountPaid)?.toFixed(2)}
                                  {parseFloat(item?.amount) -
                                    parseFloat(item?.amountPaid)?.toFixed(2) <
                                    1 && (
                                    <span className="text-green-600 font-bold">
                                      {" "}
                                      Fully Paid
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center mb-1 ">
                          <p>Report</p>
                          <button
                            onClick={() => {
                              setReport(item?.report);
                              setTestId(item?._id);
                              open();
                            }}
                            className="bg-primary px-5 py1 rounded-md text-light hover:bg-opacity-80"
                          >
                            Add Report{" "}
                          </button>
                        </div>
                        <p className="border py-2 rounded-md px-3 ">
                          {item?.report || "Not added yet"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
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
    </div>
  );
}

export default ClientExams;
