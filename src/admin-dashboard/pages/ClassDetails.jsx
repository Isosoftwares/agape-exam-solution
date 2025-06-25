import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import ReAssignWriter from "../components/ReAssignWriter";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Skeleton } from "@mantine/core";
import DeleteOrder from "../components/DeleteOrder";
import AddOrderReport from "../components/AddOrderReport";
import useAuth from "../../hooks/useAuth";
import CompleteClass from "../components/CompleteClass";
import formatDateTime from "../../utils/formatDateandTime";

function ClassDetails() {
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
    openedComplete,
    { open: openComplete, close: closeComplete },
  ] = useDisclosure(false);
  const [
    openedAddReport,
    { open: openAddReport, close: closeAddReport },
  ] = useDisclosure(false);

  // get class types
  const getClientOrders = async () => {
    return await axios.get(`/classes/one/${_id}`);
  };

  const {
    isLoading: loadingClasse,
    data: classData,
    refetch: refetchOrder,
    isRefetching: refetchingOrder,
  } = useQuery({
    queryFn: getClientOrders,
    queryKey: [`class-details-${_id}`],
    keepPreviousData: true,
  });
  return (
    <div>
      {/* Reassign writer modal */}
      <Modal
        opened={openedReAssignWriter}
        onClose={closeReAssignWriter}
        title="Assign/ Re-Assign Writer"
      >
        <ReAssignWriter
          link={`/classes/assign-writer`}
          _id={_id}
          closeModal={closeReAssignWriter}
          invalidate={`class-details-${_id}`}
          transitionProps={{ transition: "fade", duration: 200 }}
          orderType="class"
          writerAmount={classData?.data?.writerAmount}
        />
      </Modal>

      {/* delete order */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <DeleteOrder
          link={`/classes/${_id}`}
          description={"class order"}
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
          report={classData?.data?.report || ""}
          link={`/classes/class-report`}
          handleClose={closeAddReport}
          closeModal={closeAddReport}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      {/* complete modalr */}
      <Modal
        opened={openedComplete}
        onClose={closeComplete}
        title="Mark Class as Complete"
      >
        <CompleteClass
          closeModal={closeComplete}
          order={classData?.data}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      <p className="font-bold text-lg ">Class Details </p>
      <Skeleton visible={loadingClasse}>
        <div className="bg-light mb-3 py-3 px-3  rounded-md border hover:bg-[#ffffff] ">
          {/* buttons */}
          <div className="flex items-center justify-between  ">
            <p className="text-md text-blue-500  font-bold w-[70%] underline underline-offset-4 ">
              Class Type: {classData?.data?.classType}
            </p>
            <div
              className={` ${
                auth?.roles?.includes("Writer") && "hidden"
              } flex items-center gap-3`}
            >
              {/* <span
              className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-primary hover:text-light "
              title="Edit classData"
            >
              <MdEdit />
            </span> */}
              <span
                onClick={() => {
                  openDelete();
                }}
                className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
                title="Delete classData"
              >
                <MdDelete />
              </span>
            </div>
          </div>
          <p className="text-md text-blue-500  font-bold">
            Class No: #{classData?.data?.classNo}
          </p>

          {/* details */}
          <div className="flex flex-col md:flex-row gap-3 ">
            <div className="w-full">
              <table>
                <tr>
                  <td className="font-bold ">Class Status</td>
                  <td className="font-bold ">: {classData?.data?.status}</td>
                </tr>
                <tr>
                  <td className="font-bold ">No of classes</td>
                  <td className="font-bold ">
                    : {classData?.data?.noOfClasses}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Client</td>
                  <td className="font-bold capitalize text-blue-500">
                    <Link
                      className="font-bold"
                      to={`/dashboard/clients/${classData?.data?.clientId?._id}`}
                    >
                      : {classData?.data?.clientId?.email?.split("@")[0]}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold ">Create At</td>
                  <td className="font-bold capitalize text-blue-500">
                    {formatDateTime(classData?.data?.createdAt)}
                  </td>
                </tr>
                <tr
                  className={`${auth?.roles?.includes("Writer") && "hidden"}`}
                >
                  <td className="font-bold ">Assigned Writer</td>
                  {classData?.data?.isPaid ? (
                    <td className="font-bold ">
                      {classData?.data?.assignedWriter?._id ? (
                        <div>
                          <div className="flex items-center">
                            :{" "}
                            <p className="font-bold">
                              {classData?.data?.assignedWriter?.userName}
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
                <tr>
                  <td className="font-bold ">Courses</td>
                </tr>
              </table>
              <div className="">
                {classData?.data?.courses?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-gray-100 my-1 rounded px-2  "
                    >
                      <p className="font-bold w-full"> {item?.courseName}</p>
                      {classData?.data?.paidWeekly &&
                        item?.weeks?.map((item, index) => {
                          return (
                            <div key={index} className="flex gap-2 w-full">
                              <p>{item?.name}</p>
                              <p>Paid: {item?.isPaid ? "Yes" : "No"}</p>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
              {/* logins */}
              <div>
                <p className="font-bold py-2">Class Logins:</p>
                <div className="border rounded-md p-2">
                  <p>
                    {" "}
                    school Link:{" "}
                    <span className="text-blue-500">
                      {classData?.data?.schoolLink}
                    </span>
                  </p>
                  <p>
                    {" "}
                    Usernmae or email:{" "}
                    <span className="text-blue-500">
                      {classData?.data?.email}
                    </span>
                  </p>
                  <p>
                    {" "}
                    Password:{" "}
                    <span className="text-blue-500">
                      {classData?.data?.password}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div
                className={`${
                  auth?.roles?.includes("Writer") && "hidden"
                } border rounded-md px-2 py-2 mt-3`}
              >
                <p className="font-bold py-2">Payments</p>
                <p className="font-bold  ">
                  Order Total: ${classData?.data?.amount}
                </p>
                <p className="font-bold  ">
                  Paid Amoint : ${classData?.data?.amountPaid}
                </p>
                <p className="font-bold  ">
                  Balance : ${" "}
                  {parseFloat(classData?.data?.amount) -
                    parseFloat(classData?.data?.amountPaid)}
                </p>
                {classData?.data?.writerAmount !== 0 && (
                  <p className="font-bold  ">
                    Writer Amount : ksh {classData?.data?.writerAmount}
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
              <div className="border rounded-md px-2 py-2 ">
                {classData?.data?.report ? (
                  <div className=" px-2">
                    <p>{classData?.data?.report}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 italic">No report added yet.</p>
                  </div>
                )}
              </div>
              {/* revision and complete */}
              <div className={` my-2 flex flex-row gap-3  `}>
                <button
                  onClick={openComplete}
                  className={` ${
                    classData?.data?.status !== "Active" && "hidden"
                  } bg-primary text-light px-3 py-1 rounded-md  `}
                >
                  Complete Exam
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="font-bold py-2">Instructions</p>
            <textarea
              disabled
              rows={4}
              value={classData?.data?.instructions || "None added"}
              className="border w-full rounded-md px-2 py-1 "
            ></textarea>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}

export default ClassDetails;
