import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Loader, Pagination } from "@mantine/core";
import formatDateTime from "../../utils/formatDateandTime";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa6";
import whatsappNumber from "../../utils/whatsappNumber";
function MyTestExams() {
  const { testType } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [clientId, setClientId] = useState(auth?.userId);
  const [status, setStatus] = useState("");

  const handleSendMessage = (testNo) => {
    const phoneNumber = whatsappNumber();
    const message = `Hello, am texting regarding ${testType} exam testNo: ${testNo} \n     
      `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  // get class types
  const getExamsFnc = async () => {
    return await axios.get(
      `/test?page=${activePage}&perPage=${perPage}&clientId=${clientId}&testType=${testType}`
    );
  };

  const {
    isLoading: loadingExams,
    data: examsData,
    refetch: refetchOrders,
    isRefetching: refetchingOrders,
  } = useQuery({
    queryFn: getExamsFnc,
    queryKey: [`my-exam-orders-${testType}`],
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(examsData?.data?.count / perPage);

  useEffect(() => {
    refetchOrders();
  }, [perPage, activePage, status]);

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
      queryClient.invalidateQueries([`my-exam-orders-`]);
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

  return (
    <div>
      <div>
        <div className="bg-light">
          <div className="py-4 px-3">
            <h1 className="text-primary text-xl font-bold leading-tight mb-3 capitalize">
              My {testType} Exams
            </h1>
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
                  <p className="text-lg">
                    We can do your{" "}
                    <span className="font-bold text-blue-500 text-lg">
                      {testType} exam
                    </span>{" "}
                    on your behalf. Just{" "}
                    <span
                      className="font-bold text-blue-500 text-lg cursor-pointer "
                      onClick={() => {
                        navigate(
                          `/${testType?.toLocaleLowerCase()}/take-my-test/${testType?.toLocaleLowerCase()}`
                        );
                      }}
                    >
                      Click Here
                    </span>{" "}
                    to add it{" "}
                  </p>
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
                                <td>Status:</td>
                                <td className="font-bold">{item?.status}</td>
                              </tr>
                            </table>
                          </div>
                          <div className="w-full">
                            <table>
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
                            <div className="flex gap-2">
                              {parseFloat(item?.amount) -
                                parseFloat(item?.amountPaid) >
                                0 && (
                                <button
                                  onClick={() => {
                                    const data = {
                                      orderId: item?._id,
                                      orderType: "doMyTest",
                                      userId: auth?.userId,
                                      amount:
                                        parseFloat(item?.amount) -
                                        parseFloat(item?.amountPaid),
                                    };
                                    payMutate(data);
                                  }}
                                  disabled={loadingPay}
                                  className="bg-primary disabled:bg-gray-600 px-5 py1 rounded-md text-light hover:bg-opacity-80"
                                >
                                  {loadingPay ? "Please wait..." : "Pay Now"}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleSendMessage(item?.testNo);
                                }}
                                className="bg-secondary flex items-center gap-2 disabled:bg-gray-600 px-5 py1 rounded-md text-light hover:bg-opacity-80"
                              >
                                <span>Chat With Us</span> <FaWhatsapp />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p>Report</p>
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

export default MyTestExams;
