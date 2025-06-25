import React from "react";
import ExamPriceSetting from "../components/ExamPriceSetting";
import ClassPricingSettings from "../components/ClassPricingSettings";
import AssignmentPriceSetting from "../components/AssignmentPriceSetting";
import useAuth from "../../hooks/useAuth";

function Pricing() {
  const { auth } = useAuth();

  if (auth?.roles?.includes("Manager")) {
    return (
      <div className="bg-light p-5 text-center ">
        <p className="text-brown-600 text-lg font-bold">Unauthorized!</p>
        <p>Contact Admin for any price updates!</p>
      </div>
    );
  }

  return (
    <div>
      <p>Price Settings</p>

      <div className="grid lg:grid-cols-2 gap-4 ">
        {/* exams */}
        <div>
          <ExamPriceSetting />
        </div>
        <div>
          <ClassPricingSettings />
        </div>
        <div>
          <AssignmentPriceSetting />
        </div>
      </div>
    </div>
  );
}

export default Pricing;
