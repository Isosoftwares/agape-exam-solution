import { Avatar, Modal, Skeleton, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import UserAvatar from "../../assets/graphics/avatar.png";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import { useDisclosure } from "@mantine/hooks";
import PayWriter from "../components/PayWriter";
import WriterEarnings from "../components/WriterEarnings";
import WriterPayment from "../components/WriterPayment";
import DeductWriterEarning from "../components/DeductWriterEarning";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function WriterDetails() {
  const axios = useAxiosPrivate();
  const { _id } = useParams();
  const { auth } = useAuth();
  const [
    openedPayWiter,
    { open: openPayWriter, close: closePayWriter },
  ] = useDisclosure(false);

  const [
    openedDeductWriter,
    { open: openDeductWriter, close: closeDeductWriter },
  ] = useDisclosure(false);

  //get user profile
  const getProfile = () => {
    return axios.get(`/user/one/${_id}`);
  };

  const {
    isLoading: loadindUser,
    error: profileError,
    data: userData,
    refetch,
  } = useQuery({
    queryKey: [`user-${_id}`, _id],
    queryFn: getProfile,
    keepPreviousData: true,
  });
  const imgUrl = userData?.data?.imgUrl;

  return (
    <div>
      {/* pay writer */}
      <Modal
        opened={openedPayWiter}
        onClose={closePayWriter}
        title="Pay Writer"
      >
        <PayWriter writer={userData?.data?.user} closeModal={closePayWriter} />
      </Modal>

      {/* Deduct writer */}
      <Modal
        opened={openedDeductWriter}
        onClose={closeDeductWriter}
        title="Deduct Writer Earnings"
      >
        <DeductWriterEarning
          writer={userData?.data?.user}
          closeModal={closeDeductWriter}
        />
      </Modal>

      {/* profile  */}
      <div className="flex flex-col md:flex-row gap-5 justify-between">
        {/* info */}
        <div className="w-full border border-secondary min-h-[200px] px-2 bg-light bg-opacity-80 rounded-md mt-2 pb-2 shadow-md shadow-cyan-50">
          <p className="font-bold p-2  ">Writer profile info</p>
          <Skeleton visible={loadindUser}>
            <div className="flex gap-4 bg-gray-50 p-5 rounded-md ">
              <div class=" w-32 h-32 relative overflow-hidden">
                <Avatar
                  className="w-[100px] h-[100px] rounded-full "
                  src={imgUrl || UserAvatar}
                />
              </div>
              <div>
                <p className="text-gray-900 font-bold   ">
                  {userData?.data?.user?.userName}
                </p>
                <p className="text-blue-900 font-bold   ">
                  {userData?.data?.user?.email}
                </p>
                <p className="text-gray-900 font-bold   ">
                  {userData?.data?.user?.phoneNo}
                </p>
                <div className="flex gap-3 items-center ">
                  <p>Status:</p>
                  <p
                    className={`${
                      userData?.data?.user?.status === "Active"
                        ? "text-green-500"
                        : " text-red-500"
                    } font-bold`}
                  >
                    {userData?.data?.user?.status}
                  </p>
                </div>
              </div>
            </div>
          </Skeleton>
        </div>
        {/* payments */}
        <div
          className={` w-full border border-secondary min-h-[200px] px-2 bg-light bg-opacity-80 rounded-md mt-2 pb-2 shadow-md shadow-cyan-50`}
        >
          <p className="font-bold p-2  ">Writer earning overview</p>

          <div>
            <div className="flex gap-3">
              <Skeleton visible={loadindUser}>
                <div className="border w-full rounded-md shadow-sm  bg-gray-50 p-2 ">
                  <p className="text-gray-500">Total Earning</p>

                  <p className="font-bold">
                    {(userData?.data?.user?.totalEarnings || 0)?.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "Ksh",
                      }
                    )}
                  </p>
                </div>
              </Skeleton>

              <Skeleton visible={loadindUser}>
                <div className="border w-full rounded-md shadow-sm bg-gray-50  p-2 ">
                  <p className="text-gray-500">Total Paid</p>
                  <p className="font-bold">
                    {" "}
                    {(userData?.data?.user?.totalPaid || 0)?.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "Ksh",
                      }
                    )}
                  </p>
                </div>
              </Skeleton>
            </div>

            <Skeleton visible={loadindUser}>
              <div className="mt-4 flex  gap-4">
                <p className="text-gray-500">Balance:</p>
                <p
                  className={`${
                    parseFloat(userData?.data?.user?.totalEarnings || 0) -
                      parseFloat(userData?.data?.user?.totalPaid || 0) <
                      0 && "text-red-500"
                  } font-bold`}
                >
                  {(
                    parseFloat(userData?.data?.user?.totalEarnings || 0) -
                    parseFloat(userData?.data?.user?.totalPaid || 0)
                  )?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "Ksh",
                  })}
                </p>
              </div>
            </Skeleton>
            <div className="flex justify-center gap-2 py-4">
              <button
                onClick={openPayWriter}
                className={` ${usePrimaryColor()} px-5 shadow-md shadow-cyan-50  disabled:bg-gray-400 disabled:cursor-not-allowed py-1 text-light rounded hover:bg-opacity-90 ease-in-out duration-300 `}
              >
                Pay writer
              </button>
              <button
                onClick={openDeductWriter}
                className={`bg-red-200 px-5 shadow-md shadow-cyan-50  disabled:bg-gray-400 disabled:cursor-not-allowed py-1 text-light rounded hover:bg-opacity-90 ease-in-out duration-300 `}
              >
                Deduct writer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* transactions*/}
      <div className="w-full border min-h-[200px] px-2  bg-light bg-opacity-80 rounded-md mt-6 pb-2 shadow-md shadow-cyan-50">
        <p className="font-bold p-2  ">Payment transactions </p>
        <div>
          <Tabs defaultValue="earnings">
            <Tabs.List justify="center" grow>
              <Tabs.Tab value="earnings" className="bg-gray-100">
                Earnings
              </Tabs.Tab>
              <Tabs.Tab value="payments" className="bg-gray-100">
                Payments
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="earnings">
              {loadindUser ? (
                <Skeleton height={200} />
              ) : (
                <WriterEarnings writerId={_id} />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="payments">
              {loadindUser ? (
                <Skeleton height={200} />
              ) : (
                <WriterPayment writerId={_id} />
              )}
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default WriterDetails;
