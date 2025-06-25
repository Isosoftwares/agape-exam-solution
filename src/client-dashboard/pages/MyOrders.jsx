import { Tabs } from "@mantine/core";
import React, { useState } from "react";
import ClassOrders from "../components/ClassOrders";
import ExamOrders from "../components/ExamOrders";
import AssignmetOrders from "../components/AssignmentOrders";

function MyOrders() {
  const [orderTab, setOrderTab] = useState(
    localStorage.getItem("orderTab") || "Class"
  );

  return (
    <div>
      <h1 className="font-bold text-2xl py-2">My orders</h1>
      <p className="text-lg font-medium">Track the progress of your work!</p>

      {/* tabs */}
      <div className="mt-3">
        <Tabs radius="md" defaultValue={orderTab} color="indigo">
          <Tabs.List className="bg-gray-200">
            <Tabs.Tab
              value="Class"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderTab", "Class");
              }}
            >
              Classes
            </Tabs.Tab>
            <Tabs.Tab
              value="Exam"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderTab", "Exam");
              }}
            >
              Online Exam
            </Tabs.Tab>
            <Tabs.Tab
              value="Assignment"
              className="px-6"
              onClick={() => {
                localStorage.setItem("orderTab", "Assignment");
              }}
            >
              Assignment/ Essay
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Class">
            <ClassOrders />
          </Tabs.Panel>

          <Tabs.Panel value="Exam">
            <ExamOrders />
          </Tabs.Panel>

          <Tabs.Panel value="Assignment">
            <AssignmetOrders />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default MyOrders;
