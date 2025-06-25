import React from "react";
import whatsappNumber from "../../utils/whatsappNumber";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiMath } from "react-icons/bi";
import { FcReadingEbook } from "react-icons/fc";
import { GiRead } from "react-icons/gi";
import { RiEnglishInput } from "react-icons/ri";
import CTA from "../../website/components/CTA";
import { TbSocial } from "react-icons/tb";
import { FaSunPlantWilt } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import PremiumCTA from "../../client-dashboard/components/PremiumCTA";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Subscriptions from "../../website/components/Subscriptions";
import { Modal } from "@mantine/core";
import 'animate.css';

function HESIOverview() {
  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would need to inquire about your exams services."
  );
  const { auth } = useAuth();
  const [openedSubs, { open: openSubs, close: closeSubs }] = useDisclosure(
    false
  );
  const isMobile = useMediaQuery("(max-width: 50em)");

  function checkSubscriptionBool(subscriptions, serviceName) {
    const hasSubscription = subscriptions.some(
      (subscription) =>
        subscription.subscriptionId.serviceName.toLowerCase() ===
        serviceName.toLowerCase()
    );
    return hasSubscription;
  }

  function checkSubscription(subscriptions, serviceName) {
    const hasSubscription = subscriptions.some(
      (subscription) =>
        subscription.subscriptionId.serviceName.toLowerCase() ===
        serviceName.toLowerCase()
    );
    return hasSubscription ? "/hesi/test/Priority Premium Test" : "/hesi/test/Free";
  }
  const pathName = checkSubscription(auth?.subscription, "HESI");

  const subjects = [
    {
      name: "Reading Comprehension",
      icon: <GiRead color="#4C3BCF" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
    {
      name: "Mathematics",
      icon: <BiMath color="#6EACDA" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
    {
      name: "Anatomy and Physiology",
      icon: <TbSocial color="#FF8225" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
    {
      name: "Biology",
      icon: <FaSunPlantWilt color="#00712D" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
    {
      name: "Vocabulary",
      icon: <RiEnglishInput color="#A91D3A" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
    {
      name: "Grammar",
      icon: <FcReadingEbook color="#002159" size={50} />,
      link: "/hesi/test/Priority Premium Test",
      description:
        "This is subject description on why to take the test and review your test papers anytime you need to.",
    },
  ];

  return (
    <div>
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
          serviceName={"HESI"}
        />
      </Modal>
      <div className="bg-light">
        <div className="mx-auto py-4 flex flex-col md:flex-row space-y-4">
          {/* First Section */}
          <div className="p-4 rounded-lg w-full">
            <h2 className="text-start text-primary text-xl font-bold mb-2">
              HESI Practice Test Library
            </h2>
            <p className="text-brown-500">
              Prepare with the most precise questions and comprehensive answer
              explanations.
            </p>

            <div className="flex justify-start gap-4">
              <button
                className={` ${
                  checkSubscriptionBool(auth?.subscription, "HESI") && "hidden"
                } bg-primary text-light px-5 py-1 rounded-md`}
                onClick={openSubs}
              >
                Subscribe
              </button>
              <a
                target="_blank"
                href={`https://wa.me/${whatsappNumber()}?text=${defaultMessage}`}
                className="bg-brown-500 text-light px-3 py-1 rounded-md flex items-center gap-2"
              >
                <FaWhatsapp />
                <span>Talk to us</span>
              </a>
            </div>
          </div>
          {/* Second Section */}
          <div className="  p-4 rounded-lg w-full">
            <h2 className="text-start text-primary text-xl font-bold mb-2">
              Do You Have an Upcoming HESI Exam?
            </h2>
            <p className="text-brown-500">
              Let's take your test and gain the assurance of a pass guarantee in
              your HESI exam.
            </p>

            <div className="flex justify-center">
              <Link
                to={"/hesi/take-my-test/hesi"}
                className="bg-secondary shadow-md text-light px-5 py-1 rounded-md capitalize animate__animated animate__pulse animate__delay-2s animate__infinite"
              >
             Take the test on my behalf
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* subjects */}
      <div>
        <p className="py-4 text-lg  ">
          Explore all the subjects take practice tests and review your
          perfomance{" "}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
          {subjects.map((item, index) => {
            return (
              <Link
                to={`${item?.link}`}
                key={index}
                className="bg-[#fcfdfd] py-3 px-3 rounded-md border-2 border-b-secondary "
              >
                <div className="flex justify-center items-center">
                  {item?.icon}
                </div>
                <div className="pb-2 ">
                  <p className="text-lg text-center text-primary">
                    {item?.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* cta */}
      <div className=" mt-5 ">
        <PremiumCTA serviceName={"HESI"} />
      </div>
    </div>
  );
}

export default HESIOverview;
