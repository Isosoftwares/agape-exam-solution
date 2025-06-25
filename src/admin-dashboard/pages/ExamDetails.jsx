import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import formatDateTime from "../../utils/formatDateandTime";
import { Modal, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ReAssignWriter from "../components/ReAssignWriter";
import DeleteOrder from "../components/DeleteOrder";
import AddOrderReport from "../components/AddOrderReport";
import CompleteExam from "../components/CompleteExam";
import useAuth from "../../hooks/useAuth";

function ExamDetails() {
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [
    openedReAssignWriter,
    { open: openReAssignWriter, close: closeReAssignWriter },
  ] = useDisclosure(false);
  const [
    openedDelete,
    { open: openDelete, close: closeDelete },
  ] = useDisclosure(false);

  const [
    openedAddReport,
    { open: openAddReport, close: closeAddReport },
  ] = useDisclosure(false);

  const [
    openedComplete,
    { open: openComplete, close: closeComplete },
  ] = useDisclosure(false);

  // get exam
  const getClientOrders = async () => {
    return await axios.get(`/exams/one/${_id}`);
  };

  const {
    isLoading: loadingExam,
    data: examData,
    refetch: refetchOrders,
    isRefetching: refetchingOrder,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`exam-details-${_id}`],
    keepPreviousData: true,
  });

  console.log(examData?.data);

  return (
    <div>
      {/* Reassign writer modal */}
      <Modal
        opened={openedReAssignWriter}
        onClose={closeReAssignWriter}
        title="Assign/ Re-Assign Writer"
      >
        <ReAssignWriter
          link={`/exams/assign-writer`}
          _id={_id}
          closeModal={closeReAssignWriter}
          invalidate={`exam-details-${_id}`}
          transitionProps={{ transition: "fade", duration: 200 }}
          writerAmount={examData?.data?.writerAmount}
          orderType="exam"
        />
      </Modal>
      {/* delete order */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <DeleteOrder
          link={`/exams/${_id}`}
          description={"exam order"}
          handleClose={closeDelete}
          navigateBack={true}
          closeModal={closeDelete}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      {/* add report */}
      <Modal
        opened={openedAddReport}
        onClose={closeAddReport}
        title="Add Report"
      >
        <AddOrderReport
          orderId={_id}
          report={examData?.data?.report || ""}
          link={`/exams/exam-report`}
          handleClose={closeAddReport}
          closeModal={closeAddReport}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      {/* complete modalr */}
      <Modal
        opened={openedComplete}
        onClose={closeComplete}
        title="Mark Exam as Complete"
      >
        <CompleteExam
          closeModal={closeComplete}
          order={examData?.data}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      <p className="font-bold text-lg ">Exam Details </p>

      <div className="bg-light mb-3 py-3 px-3  rounded-md border hover:bg-[#ffffff] ">
        <Skeleton className="mb-2" visible={loadingExam}>
          <div>
            {/* buttons */}
            <div className="flex items-center justify-between  ">
              <p className="text-md text-blue-500  font-bold w-[70%] underline underline-offset-4 ">
                Exam Type: {examData?.data?.examType}
              </p>
              <div
                className={`${
                  auth?.roles?.includes("Writer") && "hidden"
                } flex items-center gap-3`}
              >
                {/* <span
                  className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-primary hover:text-light "
                  title="Edit examData?.data"
                >
                  <MdEdit />
                </span> */}
                <span
                  onClick={() => {
                    openDelete();
                  }}
                  className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
                  title="Delete examData?.data"
                >
                  <MdDelete />
                </span>
              </div>
            </div>
            <p className="text-md 00  font-bold  ">
              Exam No: #{examData?.data?.examNo}
            </p>

            {/* details */}
            <div className="flex flex-col md:flex-row gap-3 ">
              <div className="w-full">
                <table>
                  <tr>
                    <td>Exam Date</td>
                    <td className="font-bold ">
                      : {formatDateTime(examData?.data?.date)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold py-2">Exam Status</td>
                    <td className="font-bold ">: {examData?.data?.status}</td>
                  </tr>
                  <tr>
                    <td className="font-bold ">Client</td>
                    <td className="font-bold capitalize text-blue-500">
                      <Link
                        className="font-bold"
                        to={`/dashboard/clients/${examData?.data?.clientId?._id}`}
                      >
                        : {examData?.data?.clientId?.email?.split("@")[0]}
                      </Link>
                    </td>
                  </tr>
                    <tr>
                      <td className="font-bold ">Create At</td>
                      <td className="font-bold capitalize text-blue-500">
                        {formatDateTime(examData?.data?.createdAt)}
                      </td>
                    </tr>
                  <tr className="">
                    <td className="font-bold ">Assigned Writer</td>
                    {examData?.data?.isPaid ? (
                      <td className="font-bold ">
                        {examData?.data?.assignedWriter?._id ? (
                          <div>
                            <div className="flex items-center">
                              :{" "}
                              <p className="font-bold">
                                {examData?.data?.assignedWriter?.userName}
                              </p>
                              <span
                                className="text-blue-400 mx-2 cursor-pointer"
                                onClick={() => {
                                  openReAssignWriter();
                                }}
                              >
                                Re-Assign writer
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            : N/A{" "}
                            <span
                              className="text-blue-400 cursor-pointer"
                              onClick={() => {
                                openReAssignWriter();
                              }}
                            >
                              Assign writer
                            </span>
                          </div>
                        )}
                      </td>
                    ) : (
                      <span className="mx-3 text-brown-500 ">
                        {"  "}Can not assign. Order is not fully paid!
                      </span>
                    )}
                  </tr>
                </table>
                {/* logins */}
                <div>
                  <p className="font-bold pt-2">Exam Logins:</p>
                  <div className="border rounded-md p-2">
                    <p>
                      {" "}
                      school Link:{" "}
                      <span className="text-blue-500">
                        {examData?.data?.schoolLink}
                      </span>
                    </p>
                    <p>
                      {" "}
                      Usernmae or email:{" "}
                      <span className="text-blue-500">
                        {examData?.data?.email}
                      </span>
                    </p>
                    <p>
                      {" "}
                      Password:{" "}
                      <span className="text-blue-500">
                        {examData?.data?.password}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div
                  className={` ${
                    auth?.roles?.includes("Writer") && "hidden"
                  } border rounded-md px-2 py-2 mt-3`}
                >
                  <p className="font-bold py-2">Payments</p>
                  <p className="font-bold  ">
                    Order Total: ${examData?.data?.amount}
                  </p>
                  <p className="font-bold  ">
                    Paid Amoint : ${examData?.data?.amountPaid}
                  </p>
                  <p className="font-bold  ">
                    Balance : ${" "}
                    {parseFloat(examData?.data?.amount) -
                      parseFloat(examData?.data?.amountPaid)}
                  </p>
                  {examData?.data?.writerAmount !== 0 && (
                    <p className="font-bold  ">
                      Writer Amount : ksh {examData?.data?.writerAmount}
                    </p>
                  )}
                </div>
                <div className="flex  gap-4 ">
                  <p>Class Report </p>
                  <div>
                    <span
                      className="border bg-tertiary  px-4 py-1 rounded-2xl cursor-pointer"
                      onClick={openAddReport}
                    >
                      Add Report
                    </span>
                  </div>
                </div>
                <div className="border rounded-md ">
                  {examData?.data?.report ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 px-2">
                      <p>{examData?.data?.report}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 italic">
                        No report added yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* revision and complete */}
                <div className={` my-2 flex flex-row gap-3  `}>
                  <button
                    onClick={openComplete}
                    className={` ${
                      examData?.data?.status !== "Active" && "hidden"
                    } bg-primary text-light px-3 py-1 rounded-md  `}
                  >
                    Complete Exam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Skeleton>

        <Skeleton className="mb-4" visible={loadingExam}>
          {/* instruction */}
          <div className="">
            <div>
              <p className="font-bold py-2">Instructions</p>
              <textarea
                disabled
                rows={4}
                value={examData?.data?.instructions || "None added"}
                className="border w-full rounded-md px-2 py-1 "
              ></textarea>
            </div>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

export default ExamDetails;
