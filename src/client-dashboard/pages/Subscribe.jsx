import React from "react";
import { useLocation } from "react-router-dom";
import Subscriptions from "../../website/components/Subscriptions";

function Subscribe() {
  const location = useLocation();
  const service = location?.state?.service;
  console.log(service);
  return (
    <div className="flex justify-center px-5 items-center md:px-[30px]">
      <Subscriptions serviceName={service} />
    </div>
  );
}

export default Subscribe;
