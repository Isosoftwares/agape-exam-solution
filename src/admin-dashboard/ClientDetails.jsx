import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Divider, Modal, Skeleton, Tabs } from "@mantine/core";
import Classes from "./pages/client-orders/Classes";
import Exams from "./pages/client-orders/Exams";
import Assignements from "./pages/client-orders/Assignements";
import ClientTestPapers from "./pages/client-orders/ClientTestPapers";
import { Helmet } from "react-helmet-async";
import appName from "../utils/AppName";
import ClientSubscriptions from "./components/ClientSubscriptions";
import { useDisclosure } from "@mantine/hooks";
import CreateNewSubscription from "./components/CreateNewSubscription";
import DepositByAdmin from "./components/DepositByAdmin";

function ClientDetails() {
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const [
    openedAddSub,
    { open: openAddSub, close: closeAddSub },
  ] = useDisclosure(false);
  const [
    openedDeposit,
    { open: openDeposit, close: closeDeposit },
  ] = useDisclosure(false);

  //get user profile
  const getProfile = () => {
    return axios.get(`client/one/${_id}`);
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
  if (profileError)
    return (
      <div>
        <p className="text-red-500">An error occured fetching client!</p>
      </div>
    );

  return (
    <div>
      <Helmet>
        <title>Client Details | {appName()}</title>
      </Helmet>

      <Modal
        opened={openedAddSub}
        onClose={closeAddSub}
        title="Create New Subscription."
      >
        <CreateNewSubscription handleClose={closeAddSub} clientId={_id} />
      </Modal>
      <Modal
        opened={openedDeposit}
        onClose={closeDeposit}
        title="Create a Deposit."
      >
        <DepositByAdmin handleClose={closeDeposit} clientId={_id} />
      </Modal>

      <p>Client Info</p>
      <Skeleton visible={loadindUser}>
        <div className="w-full flex flex-col md:flex-row md:justify-between  px-2 bg-light bg-opacity-80 rounded-md mt-2 pb-2 ">
          <div className="w-full">
            <p className="font-bold">Basic Info</p>
            <table className="mb-3 ">
              <tbody>
                <tr>
                  <td>User Name:</td>
                  <td>
                    <p className="font-bold">
                      {userData?.data?.client?.email?.split("@")[0]}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td className="font-bold">{userData?.data?.client?.email}</td>
                </tr>
                <tr>
                  <td>Phone No:</td>
                  <td className="font-bold">{userData?.data?.client?.phoneNo}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-gray-700">
              Balance:{" "}
              <span className="font-bold text-dark">
                {" "}
                ${userData?.data?.client?.balance}
              </span>
            </p>
            <div>
              <button
                onClick={() => openAddSub()}
                className="bg-green-500 text-light mx-1 px-4 rounded-md "
              >
                Add New Subscription
              </button>
              <button
                onClick={() => openDeposit()}
                className="bg-primary text-light px-4 mx-2 rounded-md "
              >
                Create a Deposit
              </button>
            </div>
          </div>
        </div>
      </Skeleton>

      {/* orders */}
      <div className="py-4 px-3 bg-light mt-4 rounded-md ">
        <p className="font-bold">Client Orders</p>
        <Divider />
        <Tabs defaultValue="classes">
          <Tabs.List>
            <Tabs.Tab value="classes">Classes</Tabs.Tab>
            <Tabs.Tab value="exams">Exams</Tabs.Tab>
            <Tabs.Tab value="assignments">Assignments/ Essays</Tabs.Tab>
            <Tabs.Tab value="subscriptions">Subscriptions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="classes">
            <Classes clientId={_id} />
          </Tabs.Panel>

          <Tabs.Panel value="exams">
            <Exams clientId={_id} />
          </Tabs.Panel>

          <Tabs.Panel value="assignments">
            <Assignements clientId={_id} />
          </Tabs.Panel>
          <Tabs.Panel value="subscriptions">
            <ClientSubscriptions
              subscriptions={userData?.data?.subscriptions}
              loadingUser={loadindUser}
              clientId={_id}
            />
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* client test papers */}
      <div className="px-3  mt-2 rounded-md mb-4">
        <p className="font-bold">Client Practice Tests</p>
        <ClientTestPapers clientId={_id} />
      </div>
    </div>
  );
}

export default ClientDetails;
