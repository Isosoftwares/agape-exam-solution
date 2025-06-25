import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import SubscriptionCountdown from "../../utils/SubscriptionCountdown";
import { Divider, Modal, Pagination, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useDisclosure } from "@mantine/hooks";
import Deposit from "../components/Deposit";
import { FaInfoCircle } from "react-icons/fa";

function Wallet() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [clientId, setClientId] = useState(auth?.userId);
  const [
    openedDeposit,
    { open: openDeposit, close: closeDeposit },
  ] = useDisclosure(false);

  // get class types
  const getTransactions = async () => {
    return await axios.get(
      `/payments/transactions/?page=${activePage}&perPage=${perPage}&clientId=${clientId}`
    );
  };

  const {
    isLoading: loadingTransactions,
    data: transactionsData,
    refetch: refetchTransactions,
    isRefetching: refetchingTransactions,
  } = useQuery({
    queryFn: getTransactions,
    queryKey: [`transcations-${auth?.userId}`],
    keepPreviousData: true,
  });
  const totalPages = Math.ceil(transactionsData?.data?.count / perPage);

  useEffect(() => {
    refetchTransactions();
  }, [perPage, activePage, clientId]);

  return (
    <div className="p-4">
      {/* depo */}
      <Modal
        opened={openedDeposit}
        onClose={closeDeposit}
        title="Add Funds to your wallet."
      >
        <Deposit handleClose={closeDeposit} clientId={auth?.userId} />
      </Modal>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Wallet</h3>
        <div className="border  p-4 rounded bg-light shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex gap-2 items-center ">
                <h2 className="text-lg font-semibold">My balance</h2>
                <Tooltip
                  multiline
                  w={220}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label="You can use this balance to place assignment, class or exam orders  "
                >
                  <div title="">
                    <FaInfoCircle size={15} />
                  </div>
                </Tooltip>
              </div>
              <p className="text-2xl mt-3">${auth?.balance?.toFixed(2)}</p>
            </div>
            <button
              onClick={openDeposit}
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              Add funds
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">My Subscriptions</h3>
        {!auth?.subscription?.length ? (
          <p className="bg-light py-3 px-2">
            You dont have any subscriptions yet.
          </p>
        ) : (
          <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auth?.subscription?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="border p-4 rounded shadow-xs bg-light "
                >
                  <p className="font-bold text-lg   ">
                    {item?.subscriptionId?.name}
                  </p>
                  <Divider />
                  <p>Expires on: {item?.expiryDate?.split("T")[0]}</p>
                  <SubscriptionCountdown subscription={item} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>

        <div className=" rounded shadow-sm bg-light overflow-x-auto ">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Transaction Code</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {loadingTransactions || refetchingTransactions ? (
                <tr>
                  <td colSpan={5} className="text-center py-3 ">
                    {" "}
                    Getting tyransactions....
                  </td>
                </tr>
              ) : transactionsData?.data?.message ? (
                <tr>
                  <td colSpan={5} className="text-center py-3 ">
                    {transactionsData?.data?.message}
                  </td>
                </tr>
              ) : (
                transactionsData?.data?.transactions?.map((item, index) => {
                  return (
                    <tr key={index} className=" hover:bg-gray-100 ">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {item?.transactionCode}
                      </td>
                      <td className="border px-4 py-2">{item?.description}</td>
                      <td className="border px-4 py-2">{item?.createdAt}</td>
                      <td className="border px-4 py-2 font-bold  ">
                        ${item?.amount?.toFixed()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="my-4 flex flex-row flex-wrap gap-4 items-center bg-light py-2 px-1">
            <Pagination
              total={totalPages || 0}
              page={activePage}
              color="#002159"
              onChange={setPage}
            />
            <div
              className={` ${
                transactionsData?.data?.message && "hidden"
              } flex items-center `}
            >
              <p className="">
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
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                </select>
                items per page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
