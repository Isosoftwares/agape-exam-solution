import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Divider, Modal, Pagination } from "@mantine/core";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingSpinner from "../../components/LoadingSpinner";
import SubscriptionCountdown from "../../utils/SubscriptionCountdown";
import { useDisclosure } from "@mantine/hooks";
import EditClientSubscription from "./EditClientSubscription";

function ClientSubscriptions({ subscriptions, loadingUser }) {
  const [openedEditSub, { open: openEditSub, close: closeEditSub }] =
    useDisclosure(false);

  const [selectedSub, setSelectedSub] = useState("");

  return (
    <div>
      {/* depo */}
      <Modal
        opened={openedEditSub}
        onClose={closeEditSub}
        title="Edit Subscription."
      >
        <EditClientSubscription
          handleClose={closeEditSub}
          clientSubscription={selectedSub}
        />
      </Modal>

      <p className="font-bold  ">Active Subscriptions </p>

      {/* table */}
      <div className="">
        {/* table */}
        <div className="overflow-x-auto overflow-y-auto  relative   ">
          <div className="">
            {loadingUser ? (
              <tr>
                <td colSpan={8} className="text-center pl-[50%] py-4">
                  <LoadingSpinner size={30} />
                </td>
              </tr>
            ) : !subscriptions?.length ? (
              <tr>
                <td colSpan={5} className="text-gray-800 text-center py-3  ">
                  <p>{"No subscriptions found"}</p>
                </td>
              </tr>
            ) : (
              <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="border p-4 rounded shadow-xs bg-light "
                    >
                      <div className="flex flex-col items-start md:flex-row md:justify-between mb-2 ">
                        <p className="font-bold text-lg   ">
                          {item?.subscriptionId?.name}
                        </p>

                        <button
                          onClick={() => {
                            setSelectedSub(item);
                            openEditSub();
                          }}
                          className="bg-green-500 text-light px-2 rounded-md "
                        >
                          Edit
                        </button>
                      </div>
                      <Divider />
                      <p>Expires on: {item?.expiryDate?.split("T")[0]}</p>
                      <SubscriptionCountdown subscription={item} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientSubscriptions;
