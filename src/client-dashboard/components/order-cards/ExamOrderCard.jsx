import React from "react";
import formatDateTime from "../../../utils/formatDateandTime";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function ExamOrderCard({ order }) {
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  // payment fn
  const paymentFn = (data) => {
    return axios.post("/payments/pay/order", data);
  };

  const { mutate: payMutate, isPending: loadingPay, error } = useMutation({
    mutationFn: paymentFn,
    onSuccess: (response) => {
      const url = response.data.url;
      const text = response.data.message;
      queryClient.invalidateQueries([`exam-orders`]);
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
    parseFloat(order?.amount) - parseFloat(order?.amountPaid);

  const onSubmitting = () => {
    const data = {
      orderId: order?._id,
      orderType: "exam",
      userId: auth?.userId,
      amount: orderBalance,
    };
    payMutate(data);
  };
  return (
    <div className="bg-light mb-3 py-3 px-3  rounded-md border hover:bg-[#ffffff] ">
      {/* buttons */}
      <div className="flex items-center justify-between  ">
        <p className="text-md text-blue-500  font-bold w-[70%] underline underline-offset-4 ">
          Exam Type: {order?.examType}
        </p>
        <div className="flex items-center gap-3">
          <span
            className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-primary hover:text-light "
            title="Edit order"
          >
            <MdEdit />
          </span>
          {/* <span
            className=" p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-red-500 hover:text-light "
            title="Delete order"
          >
            <MdDelete />
          </span> */}
        </div>
      </div>
      <p className="text-md  font-bold w-[70%]">
        Exam No: #{order?.examNo}
      </p>
      {/* details */}
      <div className="flex flex-col md:flex-row gap-3 ">
        <div className="w-full">
          <table>
            <tr>
              <td>Exam Date</td>
              <td className="font-bold ">: {formatDateTime(order?.date)}</td>
            </tr>
            <tr>
              <td className="font-bold py-2">Exam Status</td>
              <td className="font-bold ">: {order?.status}</td>
            </tr>
          </table>
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
        <div className="w-full">
          {/* logins */}
          <div>
            <p className="font-bold py-2">Exam Logins:</p>
            <div className="border rounded-md p-2">
              <p>
                {" "}
                school Link:{" "}
                <span className="text-blue-500">{order?.schoolLink}</span>
              </p>
              <p>
                {" "}
                Usernmae or email:{" "}
                <span className="text-blue-500">{order?.email}</span>
              </p>
              <p>
                {" "}
                Password:{" "}
                <span className="text-blue-500">{order?.password}</span>
              </p>
            </div>
          </div>
          <p className="font-bold py-2 ">Payments</p>
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
                Pay Now ${orderBalance}
              </button>
              {loadingPay && <p>Please Wait...</p>}
            </div>
          )}

          <p>Exam Report </p>
          <div className="border rounded-md ">
            {order?.report ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 px-2">
                <p>{order?.report}</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 italic">No report added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamOrderCard;
