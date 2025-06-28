import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import { Divider } from "@mantine/core";
import SubscriptionCountdown from "../../utils/SubscriptionCountdown";

function SideNav({ mobileMenu, handleMenu }) {
  const location = useLocation();
  const { pathname } = location;
  const navItems = [
    {
      name: "Dashboard",
      links: [
        {
          name: "Overview",
          path: "/ged/overview",
          icon: <FaAngleRight size={18} />,
        },
      ],
    },
    {
      name: "GED",
      links: [
        {
          name: "Priority Premium Test",
          path: `/ged/test/Priority Premium Test`,
          icon: <FaAngleRight size={18} />,
        },
        {
          name: "Bonus Practice Test",
          path: `/ged/test/Bonus Practice Test`,
          icon: <FaAngleRight size={18} />,
        },
        {
          name: "Take GED On my Behalf",
          path: "/ged/take-my-test/ged",
          icon: <FaAngleRight size={18} />,
        },
        {
          name: "My GED Exams",
          path: "/ged/exams/GED",
          icon: <FaAngleRight size={18} />,
        },
      ],
    },
    {
      name: "My Tests",
      links: [
        {
          name: "All Tests",
          path: "/ged/my-tests",
          icon: <FaAngleRight size={18} />,
        },
      ],
    },
  ];

  const { auth } = useAuth();

  function getSubscription(subscriptions, serviceName) {
    const subscription = subscriptions.find(
      (subscription) =>
        subscription.subscriptionId.serviceName.toLowerCase() ===
        serviceName.toLowerCase()
    );
    return subscription || null;
  }
  const subscription = getSubscription(auth.subscription, "GED");
  return (
    <div>
      <div
        className={`bg-[#e7e5f0]  hidden lg:inline-block  text-dark   z-50   w-80 min-h-screen overflow-y-auto   `}
      >
        <Link to={"/"}>
          <div className="bg-primary w-full px-2 py-4">
            <p>
              <span className="text-2xl font-bold  text-secondary  ">
                Agape{" "}
              </span>
              <span className="text-2xl font-bold  text-light  ">
                Exam Solutions
              </span>
            </p>
            <p className="text-3xl font-bold text-light">GED</p>
            {/* <img src={Logo} className=" w-full h-[100px]  bg-primary px-4 " alt="Logo" /> */}
          </div>
        </Link>
        <div className="px-4 h-[79vh] mt-2 overflow-y-auto no-scrollbar pb-5">
          <ul className="flex flex-col  gap-3  font-semibold text-opacity-100  ">
            {navItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    handleMenu();
                  }}
                >
                  <div>
                    <p className="text-gray-800 text-lg font-bold py-1 border-b-2 ">
                      {item.name}
                    </p>
                    <div className="pl-1 ">
                      {item?.links?.map((item, index) => {
                        return (
                          <Link
                            to={item?.path}
                            key={index}
                            className={` ${
                              decodeURIComponent(pathname)?.includes(
                                item.path
                              ) && "bg-[#cdc7ecea] rounded-md "
                            } flex gap-2 mt-1 text-primary items-center px-4 py-2 hover:bg-[#cdc7ecea] hover:rounded-md `}
                          >
                            {item?.icon}
                            <p>{item.name}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
          {subscription !== null && (
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
      </div>

      {/* mobile menu */}
      <div
        className={`${
          mobileMenu
            ? "translate-x-0 bg-[#e7e5f0] h-screen fixed lg:hidden z-60  text-dark     w-72  overflow-y-auto no-scrollbar transition-transform duration-300"
            : "hidden"
        }`}
      >
        <Link to={"/"} className="">
          <img src={Logo} className=" w-full h-[100px] " alt="Logo" />
        </Link>
        <div className="px-4 h-[80vh] overflow-y-auto no-scrollbar pb-5">
          <ul className="flex flex-col  gap-3  font-semibold text-opacity-100  ">
            {navItems?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    handleMenu();
                  }}
                >
                  <div>
                    <p className="text-gray-700 text-lg font-bold py-1 border-b-2 ">
                      {item.name}
                    </p>
                    <div className="pl-1 ">
                      {item?.links?.map((item, index) => {
                        return (
                          <Link
                            to={item?.path}
                            key={index}
                            className={` ${
                              pathname?.includes(item.path) &&
                              "bg-[#cdc7ecea] rounded-md "
                            } flex gap-2 mt-1 text-primary items-center px-4 py-2 hover:bg-[#cdc7ecea] hover:rounded-md `}
                          >
                            {item?.icon}
                            <p>{item.name}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
          <Link
            to={"/"}
            className="text-secondary underline underline-offset-4 md:hidden inline-block"
          >
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
