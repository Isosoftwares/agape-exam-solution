import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Divider, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Subscriptions from "../../website/components/Subscriptions";
import SubscriptionCountdown from "../../utils/SubscriptionCountdown";

function PremiumCTA({ serviceName }) {
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

  const returnOtherExams = (serviceName) => {
    if (serviceName === "GED") {
      return "HESI, TEAS";
    }
    if (serviceName === "HESI") {
      return "GED, TEAS";
    }
    if (serviceName === "TEAS") {
      return "GED, HESI";
    }
    return "GED", "HESI", "TEAS";
  };

  const returnExamsBtns = (serviceName) => {
    if (serviceName === "GED") {
      return (
        <div className="flex justify-center items-center gap-3">
          <a
            href="/teas"
            target="_blank"
            className=" bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View TEAS
          </a>
          <a
            href="/hesi"
            target="_blank"
            className=" bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View HESI
          </a>
          <a
            href="/client"
            target="_blank"
            className=" bg-brown-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View Other Services
          </a>
        </div>
      );
    }
    if (serviceName === "TEAS") {
      return (
        <div className="flex justify-center items-center gap-3">
          <a
            href="/ged"
            target="_blank"
            className=" bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View GED
          </a>
          <a
            href="/hesi"
            target="_blank"
            className=" bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View HESI
          </a>
          <a
            href="/client"
            target="_blank"
            className=" bg-brown-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View Other Services
          </a>
        </div>
      );
    }
    if (serviceName === "HESI") {
      return (
        <div className="flex justify-center items-center gap-3">
          <a
            href="/ged"
            target="_blank"
            className=" bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View GED
          </a>
          <a
            href="/teas"
            target="_blank"
            className=" bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View TEAS
          </a>
          <a
            href="/client"
            target="_blank"
            className=" bg-brown-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            View Other Services
          </a>
        </div>
      );
    }
  };
  
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
        {subscription !== null && (
          <p className="text-lg font-bold mt-3">Your Current Subscription</p>
        )}
        {subscription === null ? (
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
        ) : (
          <div className="border p-4 rounded shadow-xs border-secondary mt-3 bg-secondary bg-opacity-10 ">
            <p className="font-bold text-lg   ">
              {subscription?.subscriptionId?.name}
            </p>
            <Divider />
            {/* <p>Expires on: {subscription?.expiryDate?.split("T")[0]}</p> */}
            <SubscriptionCountdown subscription={subscription} />
          </div>
        )}
      </div>
      <div className="w-full bg-light">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Looking for other exams?
          </h2>
          <p className="text-gray-600 mb-4">
            You can also prepare for {returnOtherExams(serviceName)} using our
            premium test papers with pass guarantee
          </p>
          {returnExamsBtns(serviceName)}
        </div>
      </div>
    </div>
  );
}

export default PremiumCTA;
