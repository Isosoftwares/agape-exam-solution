import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function WriterPayment({ writerId }) {
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const axios = useAxiosPrivate();

  //   get payments
  const getPayments = () => {
    return axios.get(
      `/writer-payments/payments/${writerId}?page=${activePage}&perPage=${perPage}`
    );
  };

  const {
    isLoading: loadingPayments,
    data: paymentsData,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [`payments-${writerId}`],
    queryFn: getPayments,
    keepPreviousData: true,
    enabled: !!writerId,
  });

  const totalPages = Math.ceil(paymentsData?.data?.count / perPage);

  useEffect(() => {
    refetch();
  }, [activePage, perPage]);

  function formatDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);

    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    // Padding single-digit values with leading zeros
    const paddedDate = date.toString().padStart(2, "0");
    const paddedMonth = month.toString().padStart(2, "0");
    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    // Constructing the formatted date and time string
    const formattedDateTime = `${paddedDate}/${paddedMonth}/${year} at ${paddedHours}:${paddedMinutes}`;

    return formattedDateTime;
  }

  return (
    <div>
      {/* table */}
      <div className="overflow-x-auto overflow-y-auto mt-3  relative shadow-sm sm:rounded-md bg-white  ">
        <table className="w-full text-sm text-left   ">
          <thead
            className={`text-xs text-gray-700 bg-secondary bg-opacity-20`}
          >
            <tr>
              <th
                scope="col"
                className="py-[8px] text-start px-3  text-gray-900 whitespace-nowrap"
              >
                #
              </th>
              <th scope="col" className="py-[2px] text-start px-2 text-sm ">
                Mpesa Code / Description
              </th>
              <th scope="col" className="py-[2px] text-start px-2 text-sm">
                Created On
              </th>

              <th scope="col" className="py-[2px] text-start px-2 text-sm">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="">
            {loadingPayments || isRefetching ? (
              <tr>
                <td colSpan={8} className="text-center pl-[50%] py-4">
                  <LoadingSpinner size={30} />
                </td>
              </tr>
            ) : paymentsData?.data?.message ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-gray-600 italic text-center py-3 "
                >
                  {paymentsData?.data?.message}
                </td>
              </tr>
            ) : (
              paymentsData?.data?.transactions?.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-50 odd:bg-gray-100 "
                  >
                    <td className="py-2 px-4 text-sm text-start">
                      {index + 1}
                    </td>
                    <td className="py-2 px-1 text-sm uppercase text-primary font-bold text-start">
                      {item?.mpesaCode}
                    </td>
                    <td className={`  py-2 px-1 text-sm text-start`}>
                      {formatDateTime(item?.createdAt)}
                    </td>

                    <td
                      className={` ${
                        item?.amount < 0 && "text-red-500"
                      }  py-2 px-1 text-sm text-start font-bold`}
                    >
                      {item?.amount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "Ksh",
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
  );
}

export default WriterPayment;
