import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdEdit, MdDelete } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Skeleton } from "@mantine/core";
// import DeleteOrder from "../components/DeleteOrder";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";


function ClassdetailsClient() {
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

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

  // payment fn
  const paymentFn = (data) => {
    return axios.post("/payments/pay/order", data);
  };

  const { mutate: payMutate, isPending: loadingPay, error } = useMutation({
    mutationFn: paymentFn,
    onSuccess: (response) => {
      const url = response.data.url;
      const text = response.data.message;
      queryClient.invalidateQueries([`class-orders`]);
      toast.success(text);
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
    parseFloat(classData?.data?.amount) -
    parseFloat(classData?.data?.amountPaid);

  const onSubmitting = () => {
    const data = {
      orderId: classData?.data?._id,
      orderType: "onlineClass",
      userId: auth?.userId,
      amount: orderBalance,
    };
    payMutate(data);
  };

  return (
    <div>
      {/* delete order */}
      {/* <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <DeleteOrder
          link={`/classes/${_id}`}
          description={"class order"}
          handleClose={closeDelete}
          navigateBack={true}
          closeModal={closeDelete}
          transitionProps={{ transition: "fade", duration: 200 }}
        />
      </Modal> */}

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
              {/* <span
              onClick={() => {
                openDelete();
              }}
              className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
              title="Delete classData"
            >
              <MdDelete />
            </span> */}
            </div>
          </div>
          <p className="text-md font-bold ">
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
                  <td className="font-bold underline underline-offset-4 ">
                    Courses
                  </td>
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
              <div className={` border rounded-md px-2 py-2 mt-3`}>
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
                {classData?.data?.isPaid ? (
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
                      Pay Now ${orderBalance}
                    </button>
                    {loadingPay && <p>Please Wait...</p>}
                  </div>
                )}
              </div>
              <div className="flex  gap-4 ">
                <p>Class Report </p>
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

export default ClassdetailsClient;
