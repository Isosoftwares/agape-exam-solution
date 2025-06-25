import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import formatDateTime from "../../utils/formatDateandTime";
import fileThumbnil from "../../assets/graphics/download-1489.svg";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Modal, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ReAssignWriter from "../components/ReAssignWriter";
import DeleteOrder from "../components/DeleteOrder";
import AddFiles from "../components/AddFiles";
import useAuth from "../../hooks/useAuth";
import Revision from "../../client-dashboard/components/Revision";
import CompleteOrder from "../../client-dashboard/components/CompleteOrder";
import OrderDeadlineCountdown from "../../utils/OrderDeadlineCountdown ";

function AssignmentDetails() {
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [
    openedReAssignWriter,
    { open: openReAssignWriter, close: closeReAssignWriter },
  ] = useDisclosure(false);
  const [
    openedRevision,
    { open: openRevision, close: closeRevision },
  ] = useDisclosure(false);
  const [
    openedDelete,
    { open: openDelete, close: closeDelete },
  ] = useDisclosure(false);
  const [
    openedComplete,
    { open: openComplete, close: closeComplete },
  ] = useDisclosure(false);
  const [
    openedAddFiles,
    { open: openAddFiles, close: closeAddFiles },
  ] = useDisclosure(false);
  const [
    openedAddSolution,
    { open: openAddSolution, close: closeAddSolution },
  ] = useDisclosure(false);

  // get assignment
  const getClientOrder = async () => {
    return await axios.get(`/assignments/one/${_id}`);
  };

  const {
    isLoading: loadingAssignments,
    data: assignmentData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getClientOrder,
    queryKey: [`assignments-details-${_id}`],
    keepPreviousData: true,
  });

  const handleFileDownload = (link) => {
    const downloadUrl = `${link}`;

    const anchorElement = document.createElement("a");
    anchorElement.href = downloadUrl;
    anchorElement.target = "_blank";
    anchorElement.download = link.split("/").pop(); // Set the downloaded file name

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  };

  return (
    <div>
      {/* Reassign writer modal */}
      <Modal
        opened={openedReAssignWriter}
        onClose={closeReAssignWriter}
        title="Assign/ Re-Assign Writer"
      >
        <ReAssignWriter
          link={`/assignments/assign-writer`}
          _id={_id}
          closeModal={closeReAssignWriter}
          invalidate={`assignments-details-${_id}`}
          writerAmount={assignmentData?.data?.writerAmount}
          writerDeadline={assignmentData?.data?.writerDeadline}
          transitionProps={{ transition: "fade", duration: 200 }}
          orderType="assignment"
        />
      </Modal>
      {/* complete modalr */}
      <Modal
        opened={openedComplete}
        onClose={closeComplete}
        title="Mark assignemnt as Complete"
      >
        <CompleteOrder
          closeModal={closeComplete}
          order={assignmentData?.data}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>

      {/* delete order */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <DeleteOrder
          link={`/assignments/${_id}`}
          description={"assignment order"}
          handleClose={closeDelete}
          closeModal={closeDelete}
          navigateBack={true}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      {/* revision modalr */}
      <Modal
        opened={openedRevision}
        onClose={closeRevision}
        title="Request Revision"
      >
        <Revision
          closeModal={closeRevision}
          _id={assignmentData?.data?._id}
          revisionReason={assignmentData?.data?.revisionReason}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>

      {/* add files */}
      <Modal opened={openedAddFiles} onClose={closeAddFiles} title="Add files">
        <AddFiles
          handleClose={closeAddFiles}
          orderId={_id}
          closeModal={closeAddFiles}
          link={`/assignments/update-attachments/${_id}`}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>

      {/* add solution */}
      <Modal
        opened={openedAddSolution}
        onClose={closeAddSolution}
        title="Upload Solution files"
      >
        <AddFiles
          handleClose={closeAddSolution}
          orderId={_id}
          closeModal={closeAddSolution}
          link={`/assignments/upload-solution/${_id}`}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>

      <p className="font-bold text-lg ">Assignment Orders </p>
      <Skeleton className="mb-4 " visible={loadingAssignments}>
        <div className="bg-light mb-3 py-3 px-3  rounded-md border hover:bg-[#ffffff] ">
          {/* buttons */}
          <div className="flex items-center justify-between  border-b pb-1">
            <p className="text-md text-blue-500  font-bold w-[70%] ">
              {assignmentData?.data?.title}
            </p>
            <div
              className={` ${
                auth?.roles?.includes("Writer") && "hidden"
              } flex items-center gap-3`}
            >
              {/* <span
                className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-primary hover:text-light "
                title="Edit assignmentData?.data"
              >
                <MdEdit />
              </span> */}
              <span
                onClick={() => {
                  openDelete();
                }}
                className={`" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light `}
                title="Delete assignmentData?.data"
              >
                <MdDelete />
              </span>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col md:flex-row gap-3 ">
            <div className="w-full">
              <p className="text-md text-blue-500  font-bold w-[70%] ">
                Order No : #{assignmentData?.data?.orderNo}
              </p>
              <table>
                <tr>
                  <td className="font-bold ">Type</td>
                  <td className="font-bold ">
                    : {assignmentData?.data?.workSizeType}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Size</td>
                  <td className="font-bold ">
                    : {assignmentData?.data?.workSize}{" "}
                    {assignmentData?.data?.workSizeType}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Status</td>
                  <td className="font-bold ">
                    : {assignmentData?.data?.status}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Deadline</td>
                  <td className="font-bold ">
                    : {formatDateTime(assignmentData?.data?.dueDate)}
                  </td>
                </tr>
                {assignmentData?.data?.writerDeadline && (
                  <tr>
                    <td className="font-bold "> Writer Deadline</td>
                    <td className="font-bold ">
                      :{" "}
                      <span>
                        <span className="font-bold  ">
                          {formatDateTime(assignmentData?.data?.writerDeadline)}{" "}
                          ||
                        </span>
                        <OrderDeadlineCountdown
                          deadline={
                            new Date(assignmentData?.data?.writerDeadline)
                          }
                        />
                      </span>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="font-bold ">Client</td>
                  <td className="font-bold capitalize text-blue-500">
                    <Link
                      className="font-bold"
                      to={`/dashboard/clients/${assignmentData?.data?.clientId?._id}`}
                    >
                      : {assignmentData?.data?.clientId?.email?.split("@")[0]}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Create At</td>
                  <td className="font-bold capitalize text-blue-500">
                    {formatDateTime(assignmentData?.data?.createdAt)}
                  </td>
                </tr>
                <tr
                  className={`${auth?.roles?.includes("Writer") && "hidden"}`}
                >
                  <td className={` font-bold `}>Assigned Writer </td>
                  {assignmentData?.data?.isPaid ? (
                    <td className={`"font-bold  `}>
                      {assignmentData?.data?.assignedWriter?._id ? (
                        <div>
                          <div className="flex items-center">
                            :{" "}
                            <p className="font-bold">
                              {assignmentData?.data?.assignedWriter?.userName}
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
              <div className="flex justify-between">
                <p className="font-bold py-2">Solution</p>
                <div>
                  <span
                    className="bg-tertiary px-4 py-1 cursor-pointer rounded-full "
                    onClick={() => {
                      openAddSolution();
                    }}
                  >
                    Upload Solution
                  </span>
                </div>
              </div>
              <div className="border rounded-md ">
                {assignmentData?.data?.solution?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 px-2">
                    {assignmentData?.data?.solution?.map((file, index) => (
                      <div
                        key={index}
                        title={file.fileName}
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileDownload(file?.filePath);
                        }}
                        className="cursor-pointer flex flex-col overflow-hidden items-center justify-center bg-gray-50 px-1 my-1 "
                      >
                        <img
                          src={fileThumbnil}
                          alt="file"
                          className="h-[30px]"
                        />
                        <h1 className=" line-clamp-1 ">{file.fileName}</h1>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 italic">
                      No solution uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div
                className={` ${
                  auth?.roles?.includes("Writer") && "hidden"
                } border rounded-md px-2 py-2 mt-3  `}
              >
                <p className="font-bold py-2">Payments</p>
                <p className="font-bold  ">
                  Order Total: ${assignmentData?.data?.amount}
                </p>
                <p className="font-bold  ">
                  Paid Amoint : ${assignmentData?.data?.amountPaid}
                </p>
                <p className="font-bold  ">
                  Balance : ${" "}
                  {parseFloat(assignmentData?.data?.amount) -
                    parseFloat(assignmentData?.data?.amountPaid)}
                </p>
                {assignmentData?.data?.writerAmount !== 0 && (
                  <p className="font-bold  ">
                    Writer Amount : ksh {assignmentData?.data?.writerAmount}
                  </p>
                )}
              </div>
              {assignmentData?.data?.status === "Revision" && (
                <div>
                  <p className="text-brown-500 font-bold">Revision Reason </p>
                  <textarea
                    name=""
                    disabled
                    className="w-full p-[5px] disabled:bg-gray-100 focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    value={assignmentData?.data?.revisionReason}
                    id=""
                  ></textarea>
                </div>
              )}
              <div
                className={`${
                  assignmentData?.data?.status === "Completed" && "hidden"
                } my-2 flex flex-row gap-3  `}
              >
                <button
                  className={` ${
                    assignmentData?.data?.status !== "Submitted" && "hidden"
                  } bg-brown-300 text-light px-3 py-1 rounded-md  `}
                  onClick={openRevision}
                >
                  Request Revision
                </button>
                <button
                  onClick={openComplete}
                  className={` ${
                    assignmentData?.data?.status !== "Submitted" && "hidden"
                  } bg-primary text-light px-3 py-1 rounded-md  `}
                >
                  Complete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
      {/* instructions */}
      <Skeleton visible={loadingAssignments} className="mb-5">
        <div className="bg-light px-2 py-2 flex flex-col-reverse gap-3 ">
          <div className="w-full gap-2">
            <p className="font-bold py-2">Instructions</p>
            <textarea
              disabled
              rows={4}
              value={assignmentData?.data?.instructions || "None added"}
              className="border w-full rounded-md px-2 py-1 "
            ></textarea>
          </div>
          <div className="w-full">
            <div className="flex justify-between my-1">
              <p className="font-bold py-2">Uploaded Documents</p>
              <div
                className={` ${
                  auth?.roles?.includes("Writer") && "hidden"
                } flex items-center gap-1 bg-gray-200 hover:bg-primary hover:text-light rounded-md mr-1 cursor-pointer px-2`}
                onClick={() => openAddFiles()}
              >
                <IoMdAdd />
                <span>Add files</span>
              </div>
            </div>
            <div className="border rounded-md ">
              {assignmentData?.data?.attachments?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 px-2">
                  {assignmentData?.data?.attachments?.map((file, index) => (
                    <div
                      key={index}
                      title={file.fileName}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFileDownload(file?.filePath);
                      }}
                      className="cursor-pointer flex flex-col items-center justify-center bg-gray-100 px-1 my-1 "
                    >
                      <img src={fileThumbnil} alt="file" className="h-[30px]" />
                      <h1 className=" line-clamp-1 ">
                        {file.fileName?.substr(0, 15)}
                      </h1>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 italic">No files uploaded.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default AssignmentDetails;
