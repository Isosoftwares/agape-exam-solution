import { Tabs } from "@mantine/core";
import React, { useState } from "react";
import ClassOrderForm from "../components/ClassOrderForm";
import ExamOrderForm from "../components/ExamOrderForm";
import AssignmentOrderForm from "../components/AssignmentOrderForm";

function CreateOrder() {
  const [orderFormTab, setOrderFormTab] = useState(
    localStorage.getItem("orderFormTab") || "Class"
  );
  return (
    <div>
      <h1 className="font-bold text-2xl py-2">Create order</h1>
      <p className="text-lg font-medium">
        Lets get started on your order! Choose a service and place order.
      </p>

      {/* tabs */}
      <div className="mt-3">
        <Tabs radius="md" defaultValue={orderFormTab} color="indigo">
          <Tabs.List className="bg-gray-200">
            <Tabs.Tab
              value="Class"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderFormTab", "Class");
              }}
            >
              Classes
            </Tabs.Tab>
            <Tabs.Tab
              value="Exam"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderFormTab", "Exam");
              }}
            >
              Online Exam
            </Tabs.Tab>
            <Tabs.Tab
              value="Assignment"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderFormTab", "Assignment");
              }}
            >
              Assignment/ Essay
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Class">
            <ClassOrderForm />
          </Tabs.Panel>

          <Tabs.Panel value="Exam">
            <ExamOrderForm />
          </Tabs.Panel>

          <Tabs.Panel value="Assignment">
            <AssignmentOrderForm />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default CreateOrder;
