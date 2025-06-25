import React from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/graphics/testpper.jpg";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Subscriptions from "./Subscriptions";

function PaperCard({ paper }) {
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

  // Handle navigation
  const handleNavigation = () => {
    if (!auth?.userId) {
      navigate("/signup", {
        state: { dashboardPath: `/${paper?.examType}` },
      });
      return;
    }

    const { subscriptionType, examType, _id } = paper;
    const examUrl = `/${examType}/take-test/${_id}`;
    const subscriptionUrl = `/${examType}-practice-test-papers#subscriptions`;

    if (subscriptionType === "Free") {
      window.open(examUrl, "_blank");
    } else if (subscriptionType === "Premium") {
      if (hasSubscription(auth?.subscription, examType)) {
        window.open(examUrl, "_blank");
      } else {
        openSubs();
      }
    } else {
      toast.info(
        "An error occurred. Please refresh your browser or contact us if the issue persists!"
      );
    }
  };

  return (
    <div className="group">
      <Modal 
        opened={openedSubs} 
        onClose={closeSubs} 
        title="" 
        size="auto"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Unlock Premium Content
            </h2>
            <p className="text-dark/70">
              Select a subscription and access all premium practice test papers
            </p>
          </div>
          <Subscriptions
            inModal={true}
            close={true}
            handleClose={closeSubs}
            serviceName={paper?.examType}
          />
        </div>
      </Modal>
      
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300  bg-white">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            loading="lazy"
            src={paper?.thumbnail || image}
            alt={paper?.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Subscription Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`${
                paper?.subscriptionType === "Free"
                  ? "bg-secondary text-light shadow-lg"
                  : "bg-gradient-to-r from-primary to-primary/80 text-light shadow-lg"
              } px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/20`}
            >
              {paper?.subscriptionType}
            </span>
          </div>

          {/* Premium Icon */}
          {paper?.subscriptionType === "Premium" && (
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
            {paper?.name}
          </h3>
          
          <p className="text-dark/60 text-sm mb-4 capitalize">
            {paper?.examType} Practice Test
          </p>

          {/* Action Button */}
          <button
            onClick={handleNavigation}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              paper?.subscriptionType === "Free"
                ? "bg-secondary hover:bg-secondary/90 text-light shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-light shadow-lg hover:shadow-xl"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
              <span>Take Test</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}

export default PaperCard;