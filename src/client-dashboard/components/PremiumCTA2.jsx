import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Divider, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Subscriptions from "../../website/components/Subscriptions";
import SubscriptionCountdown from "../../utils/SubscriptionCountdown";

function PremiumCTA2({ serviceName }) {
  const { auth } = useAuth();
  const [openedSubs, { open: openSubs, close: closeSubs }] = useDisclosure(
    false
  );

  function getSubscription(subscriptions, serviceName) {
    const subscription = subscriptions.find(
      (subscription) =>
        subscription.subscriptionId.serviceName.toLowerCase() ===
        serviceName.toLowerCase()
    );
    return subscription || null;
  }
  const subscription = getSubscription(auth?.subscription, serviceName);

  const isMobile = useMediaQuery("(max-width: 50em)");
  return (
    <div className="flex flex-col md:flex-row gap-3  mt-5 mb-6 ">
      <Modal
        opened={openedSubs}
        onClose={closeSubs}
        title=""
        size={isMobile ? "auto" : "90%"}
      >
        <div>
          <p className="font-bold text-xl text-primary text-center capitalize ">
            {" "}
            Select a subscription an access all premiums practice test papers
          </p>
        </div>
        <Subscriptions
          inModal={true}
          close={true}
          handleClose={closeSubs}
          serviceName={serviceName}
        />
      </Modal>
      <div className="w-full bg-light px-2">
        {subscription === null && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unlock {serviceName} Premium Access
            </h2>
            <p className="text-gray-600 mb-4">
              Subscribe now to access all practice test papers and enhance your
              exam preparation!
            </p>
            <button
              onClick={() => {
                openSubs();
              }}
              className=" bg-secondary text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Subscribe to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumCTA2;
