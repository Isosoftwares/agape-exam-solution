import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { toast } from "react-toastify";
import { Modal } from "@mantine/core";
import Subscriptions from "../../website/components/Subscriptions";

function TestCard({ paper }) {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const [openedSubs, { open: openSubs, close: closeSubs }] = useDisclosure(
    false
  );

  function hasSubscription(subscriptions, serviceName) {
    for (const subscription of subscriptions) {
      if (subscription.subscriptionId.serviceName === serviceName) {
        return true;
      }
    }
    return false;
  }

  //handle naavigation
  const handleNavigation = () => {
    const { subscriptionType, examType, _id } = paper;
    const examUrl = `/${examType}/take-test/${_id}`;
    const subscriptionUrl = `/${examType}-practice-test-papers#subscriptions`;

    if (subscriptionType === "Free") {
      navigate(examUrl);
    } else if (subscriptionType === "Premium") {
      if (hasSubscription(auth?.subscription, examType)) {
        navigate(examUrl);
      } else {
        openSubs();
      }
    } else {
      toast.info(
        "An error occurred. Please refresh your browser or contact us if the issue persists!"
      );
    }
  };
  const isMobile = useMediaQuery('(max-width: 50em)');
  return (
    <div className="bg-light py-2 px-3 min-h-[130px] rounded-md border-2 relative ">
      <Modal opened={openedSubs} onClose={closeSubs} title="" size={isMobile?"auto": "90%"} >
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
          serviceName={paper?.examType}
        />
      </Modal>
      {/* <div class={`  absolute  right-0 `}>
        <span
          className={`${
            paper?.subscriptionType === "Free"
              ? "bg-tertiary"
              : "bg-primary bg-opacity-80 text-light "
          } px-3 py-1 rounded mx-2 my-1  `}
        >
          {paper?.subscriptionType}
        </span>
      </div> */}
      <p className="text-[#1d2569] pt-5">{paper?.name}</p>

      <span
        onClick={handleNavigation}
        className="bg-primary/70 cursor-pointer  text-light py-2 px-3 rounded-md "
      >
        Start Exam
      </span>
    </div>
  );
}

export default TestCard;
