import React, { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Logo from "../../assets/graphics/mainlogo.png";
import { CgProfile } from "react-icons/cg";
import { Menu } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";

function ClientDashNavBar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const { auth } = useAuth();
  const navigate = useNavigate();

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    {
      name: "Overview",
      path: "/client/overview",
    },
    {
      name: "Order Now",
      path: "/client/create-order",
    },
    {
      name: "My Orders",
      path: "/client/my-orders",
    },
    {
      name: "TEAS",
      path: "/teas",
    },
    {
      name: "GED",
      path: "/ged",
    },
    {
      name: "HESI",
      path: "/hesi",
    },
    {
      name: "Wallet",
      path: "/client/wallet",
    },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 shadow-sm `}>
      <div
        className={`flex justify-between bg-primary md:justify-between md:gap-[90px]  items-center px-1   md:px-[100px]  `}
      >
        <div className="flex items-center">
          <Link to="/client/overview">
            <div className=" text-xl flex  justify-center items-center gap-1 ">
              <Link to={"/"}>
                <img src={Logo} className="  h-[70px] w-[170px] " alt="Logo" />
              </Link>
            </div>
          </Link>
          <div className="mr-[] flex items-center gap-2 ">
            <ul className="hidden lg:flex gap-3  font-semibold text-opacity-100 ">
              {navItems?.map((item, index) => {
                if (item?.name === "TEAS")
                  return (
                    <a
                    key={index}
                      href={item?.path}
                      target="_blank"
                      className={`${
                        pathname.includes(item?.path) &&
                        "underline underline-offset-4"
                      } px-3 py-2 text-light  rounded-sm hover:text-secondary `}
                    >
                      {item?.name}
                    </a>
                  );
                if (item?.name === "GED")
                  return (
                    <a
                    key={index}
                      href={item?.path}
                      target="_blank"
                      className={`${
                        pathname.includes(item?.path) &&
                        "underline underline-offset-4"
                      } px-3 py-2 text-light  rounded-sm hover:text-secondary `}
                    >
                      {item?.name}
                    </a>
                  );
                if (item?.name === "HESI")
                  return (
                    <a
                    key={index}
                      href={item?.path}
                      target="_blank"
                      className={`${
                        pathname.includes(item?.path) &&
                        "underline underline-offset-4"
                      } px-3 py-2 text-light  rounded-sm hover:text-secondary `}
                    >
                      {item?.name}
                    </a>
                  );
                return (
                  <NavLink to={item.path} key={index}>
                    <li
                      key={index}
                      className={`${
                        pathname.includes(item?.path) &&
                        "underline underline-offset-4 text-secondary"
                      } px-3 py-2 text-light  rounded-sm hover:text-secondary`}
                    >
                      {item.name}
                    </li>
                  </NavLink>
                );
              })}
            </ul>
          </div>
        </div>
        <div className=" hidden lg:flex items-center gap-3 cursor-pointer">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div className="text-light flex items-center gap-1">
                <p>{auth?.userName}</p>
                <FaAngleDown size={20} />
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <Link
                  to={"/client/profile"}
                  className="flex items-center gap-2"
                >
                  <CgProfile />
                  <p>Profile</p>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <BiLogOut />
                  <p>Logout</p>
                </div>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="lg:hidden pr-3">
          {mobileMenu ? (
            <div
              onClick={(e) => {
                setMobileMenu(!mobileMenu);
              }}
            >
              <MdClose size={30} color="#fff" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                setMobileMenu(!mobileMenu);
              }}
            >
              <MdMenu size={30} color="#fff" />
            </div>
          )}
        </div>
      </div>
      {/* mobile menu */}
      <div
        className={`${mobileMenu ? "translate-x-0 " : " -translate-x-80"}
             bg-primary  text-dark fixed inset-0 z-50 lg:hidden  w-72  overflow-y-auto no-scrollbar transition-transform duration-300 xl:translate-x-0 `}
      >
        <Link to={"/"}>
          <img src={Logo} className=" w-full h-[100px] " alt="Logo" />
        </Link>
        <ul className="flex flex-col  gap-2  font-semibold text-opacity-100 divide-y ">
          {navItems?.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={(e) => {
                  setMobileMenu(!mobileMenu);
                }}
              >
                <li className=" px-4 py-2 hover:text-primary custom-hover border-b-primary text-start cursor-pointer">
                  {item.name}
                </li>
              </NavLink>
            );
          })}
        </ul>

        <div className="flex px-5 my-6 items-center gap-3">
          <Link
            to={"/client/profile"}
            className="flex items-center gap-2 bg-primary border text-light rounded-md px-3 "
            onClick={(e) => {
              setMobileMenu(!mobileMenu);
            }}
          >
            <CgProfile />
            <p>Profile</p>
          </Link>
          <div
            className="flex items-center gap-2 bg-secondary  text-light rounded-md px-3 cursor-pointer"
            onClick={() => {
              signOut();
            }}
          >
            <BiLogOut />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashNavBar;
