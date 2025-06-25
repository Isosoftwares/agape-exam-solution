import React from "react";
import formatDateTime from "../../../utils/formatDateandTime";
import fileThumbnil from "../../../assets/graphics/download-1489.svg";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import AddFiles from "../../../admin-dashboard/components/AddFiles";
import DeleteOrder from "../../../admin-dashboard/components/DeleteOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Revision from "../Revision";
import CompleteOrder from "../CompleteOrder";

function AssignmentOrderCard({ order }) {
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [
    openedAddFiles,
    { open: openAddFiles, close: closeAddFiles },
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
    openedRevision,
    { open: openRevision, close: closeRevision },
  ] = useDisclosure(false);

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

  // payment fn
  const paymentFn = (data) => {
    return axios.post("/payments/pay/order", data);
  };

  const { mutate: payMutate, isPending: loadingPay, error } = useMutation({
    mutationFn: paymentFn,
    onSuccess: (response) => {
      const url = response.data.url;
      const text = response.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`assignments-orders`]);
      if (url !== "No url") {
        window.open(url);
      }
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const orderBalance =
    parseFloat(order?.amount) - parseFloat(order?.amountPaid);

  const onSubmitting = () => {
    const data = {
      orderId: order?._id,
      orderType: "assignment",
      userId: auth?.userId,
      amount: orderBalance,
    };
    payMutate(data);
  };
  return (
    <div className="bg-light mb-3 py-3 px-3  rounded-md border hover:bg-[#ffffff] ">
      {/* add files */}
      <Modal opened={openedAddFiles} onClose={closeAddFiles} title="Add files">
        <AddFiles
          handleClose={closeAddFiles}
          orderId={order?._id}
          link={`/assignments/update-attachments/${order?._id}`}
          closeModal={closeAddFiles}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>
      {/* delete order */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <DeleteOrder
          link={`/assignments/${order?._id}`}
          description={"assignment order"}
          handleClose={closeDelete}
          closeModal={closeDelete}
          navigateBack={false}
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
          _id={order?._id}
          revisionReason={order?.revisionReason}
          transitionProps={{ transition: "fade", duration: 200 }}
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
          order={order}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal>

      {/* buttons */}
      <div className="flex items-center justify-between  ">
        <p className="text-md text-blue-500  font-bold w-[70%] ">
          {order?.title}
        </p>

        <div className="flex items-center gap-3">
          <span
            className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-primary hover:text-light "
            title="Edit order"
          >
            <MdEdit />
          </span>
          {/* <span
            onClick={() => {
              openDelete();
            }}
            className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
            title="Delete order"
          >
            <MdDelete />
          </span> */}
        </div>
      </div>

      {/* details */}
      <p className="text-md text-blue-500  font-bold w-[70%] ">
        Order No : #{order?.orderNo}
      </p>
      <div className="flex flex-col md:flex-row gap-3 ">
        <div className="w-full">
          <table>
            <tr>
              <td className="font-bold ">Size</td>
              <td className="font-bold ">
                : {order?.workSize} {order?.workSizeType}
              </td>
            </tr>
            <tr>
              <td className="font-bold ">Type</td>
              <td className="font-bold ">: {order?.type}</td>
            </tr>
            <tr>
              <td className="font-bold ">Status</td>
              <td className="font-bold ">: {order?.status}</td>
            </tr>
            <tr>
              <td className="font-bold ">Deadline</td>
              <td className="font-bold ">: {formatDateTime(order?.dueDate)}</td>
            </tr>
          </table>

          <div>
            <div className="flex justify-between my-1">
              <p className="font-bold py-2">Uploaded Documents</p>
              <div
                className="flex items-center gap-1 bg-gray-200 hover:bg-primary hover:text-light rounded-md mr-1 cursor-pointer px-2"
                onClick={() => openAddFiles()}
              >
                <IoMdAdd />
                <span>Add files</span>
              </div>
            </div>
            <div className="border rounded-md ">
              {order?.attachments?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 px-2">
                  {order?.attachments?.map((file, index) => (
                    <div
                      key={index}
                      title={file.fileName}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFileDownload(file?.filePath);
                      }}
                      className="cursor-pointer flex flex-col overflow-hidden items-center justify-center bg-gray-50 px-1 my-1 "
                    >
                      <img src={fileThumbnil} alt="file" className="h-[30px]" />
                      <h1 className=" line-clamp-1 ">{file.fileName}</h1>
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
        <div className="w-full">
          <p className="font-bold py-2">Payments</p>
          {order?.isPaid ? (
            <div className="text-green-600 flex gap-1 items-center  ">
              <IoIosCheckmarkCircleOutline size={19} />
              <p className="text-lg">Paid</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                disabled={loadingPay}
                className="px-2 disabled:cursor-not-allowed disabled:bg-gray-500 bg-green-500 text-light rounded-md hover:bg-gray-700 "
                onClick={() => {
                  onSubmitting();
                }}
              >
                Pay Now ${orderBalance?.toFixed(2)}
              </button>
              {loadingPay && <p>Please Wait...</p>}
            </div>
          )}

          <p className="font-bold py-2">Solution</p>
          <div className="border rounded-md ">
            {order?.solution?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 px-2">
                {order?.solution?.map((file, index) => (
                  <div
                    key={index}
                    title={file.fileName}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFileDownload(file?.filePath);
                    }}
                    className="cursor-pointer flex flex-col overflow-hidden items-center justify-center bg-gray-50 px-1 my-1 "
                  >
                    <img src={fileThumbnil} alt="file" className="h-[30px]" />
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
          {/* revision and complete */}
          <div
            className={`${
              order?.status === "Completed" && "hidden"
            } my-2 flex flex-row gap-3  `}
          >
            <button
              className={` ${
                order?.status !== "Submitted" && "hidden"
              } bg-brown-300 text-light px-3 py-1 rounded-md  `}
              onClick={openRevision}
            >
              Request Revision
            </button>
            <button
            onClick={openComplete}
              className={` ${
                order?.status !== "Submitted" && "hidden"
              } bg-primary text-light px-3 py-1 rounded-md  `}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
      <div>
        <p className="font-bold py-2">Instructions</p>
        <textarea
          disabled
          rows={4}
          value={order?.instructions || "None added"}
          className="border w-full rounded-md px-2 py-1 "
        ></textarea>
      </div>
    </div>
  );
}

export default AssignmentOrderCard;
