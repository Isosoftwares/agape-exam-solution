import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/graphics/4Copy.png";
import { MdMenu, MdPriceChange, MdDashboard, MdClose } from "react-icons/md";
import { IoIosPaper } from "react-icons/io";
import { SiGoogleclassroom } from "react-icons/si";
import { PiExamBold } from "react-icons/pi";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdAddChart } from "react-icons/md";
import { GrUserExpert } from "react-icons/gr";
import { FaUsers } from "react-icons/fa6";

function SideNav({ mobileMenu, handleMenu }) {
  const location = useLocation();
  const { pathname } = location;
  const navItems = [
    {
      name: "Dashboard",
      links: [
        {
          name: "Overview",
          path: "/dashboard/overview",
          icon: <MdDashboard size={18} />,
        },
      ],
    },
    {
      name: "Orders",
      links: [
        {
          name: "Classes",
          path: "/dashboard/orders/classes",
          icon: <SiGoogleclassroom size={18} />,
        },
        {
          name: "Exams",
          path: "/dashboard/orders/exams",
          icon: <PiExamBold size={18} />,
        },
        {
          name: "Assignments",
          path: "/dashboard/orders/assignments",
          icon: <HiMiniClipboardDocumentCheck size={18} />,
        },
        {
          name: "GED/HESI/TEAS Exams",
          path: "/dashboard/client-exams",
          icon: <PiExamBold size={18} />,
        },
      ],
    },
    {
      name: "Practice Tests",
      links: [
        {
          name: "Add Papers",
          path: "/dashboard/add-paper",
          icon: <MdAddChart size={18} />,
        },
        {
          name: "All Papers",
          path: "/dashboard/all-papers",
          icon: <IoSpeedometerOutline size={18} />,
        },
        {
          name: "Client Attempts",
          path: "/dashboard/client-attempts",
          icon: <GrUserExpert size={18} />,
        },
      ],
    },
    {
      name: "Users",
      links: [
        {
          name: "My Clients",
          path: "/dashboard/clients",
          icon: <FaUsers size={18} />,
        },
        {
          name: "Clients Subscriptions",
          path: "/dashboard/client-subscription",
          icon: <FaUsers size={18} />,
        },
        {
          name: "Managers & Writers",
          path: "/dashboard/users",
          icon: <FaUsers size={18} />,
        },
      ],
    },
    {
      name: "Marketing",
      links: [
        {
          name: "Marketing Dashboard",
          path: "/dashboard/marketing-dashboard",
          icon: <MdPriceChange size={18} />,
        },
        {
          name: "Commissions Dashboard",
          path: "/dashboard/commission-dashboard",
          icon: <MdPriceChange size={18} />,
        },
         {
          name: "Referral Analytics",
          path: "/dashboard/referal-analytics",
          icon: <MdPriceChange size={18} />,
        },
      ],
    },
    {
      name: "Settings",
      links: [
        {
          name: "Pricing",
          path: "/dashboard/pricing",
          icon: <MdPriceChange size={18} />,
        },
        {
          name: "Subscriptions",
          path: "/dashboard/subscriptions",
          icon: <MdPriceChange size={18} />,
        },
      ],
    },
  ];

  return (
    <div>
      <div
        className={`bg-[#e7e5f0] relative hidden lg:inline-block  text-dark shadow-md  z-50   w-80  overflow-y-auto   `}
      >
        <Link to={"/"} className="absolute ">
          <img src={Logo} className=" w-full bg-primary " alt="Logo" />
        </Link>
        <div className="px-4 h-screen pt-[90px] overflow-y-auto no-scrollbar pb-5">
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
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`${
          mobileMenu
            ? "translate-x-0 bg-[#e7e5f0] h-screen fixed lg:hidden  text-dark  z-50   w-72  overflow-y-auto no-scrollbar transition-transform duration-300"
            : "hidden"
        }`}
      >
        <Link to={"/"} className="">
          <img
            src={Logo}
            className=" w-full h-[100px] bg-primary "
            alt="Logo"
          />
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
        </div>
      </div>
    </div>
  );
}

export default SideNav;
