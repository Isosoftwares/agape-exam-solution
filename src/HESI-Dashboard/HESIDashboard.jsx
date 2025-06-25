import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { MdMenu, MdClose } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import SideNav from "./components/SideNav";
import { Menu } from "@mantine/core";
import { FaAngleDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../hooks/useLogout";

function HESIDashboard() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const date = new Date();

  const [mobileMenu, setMobileMenu] = useState(false);

  const handleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="">
      {/* main content*/}
      <div className=" flex  bg-gray-100">
        <SideNav mobileMenu={mobileMenu} handleMenu={handleMenu} />

        <div
          className="w-full relative"
          onClick={() => {
            if (mobileMenu) setMobileMenu(false);
          }}
        >
          {/* header */}
          <div className="flex absolute z-40  top-0 right-0 left-0 bg-light shadow-sm shadow-light border-b-2 border-b-cyan-50 justify-between items-center px-3 py-6">
            <div className="flex ">
              <div className="lg:hidden pr-3">
                {mobileMenu ? (
                  <div
                    onClick={(e) => {
                      setMobileMenu(!mobileMenu);
                    }}
                  >
                    <MdClose size={30} color="#00224D" />
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      setMobileMenu(!mobileMenu);
                    }}
                  >
                    <MdMenu size={30} color="#00224D" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm capitalize">
                  Welcome back {auth?.userName}{" "}
                </p>
                <p className="text-lg text-primary">
                 HESI Practice tests
                </p>
              </div>
            </div>
            <div className=" flex items-center gap-3 cursor-pointer ">
              <Link
                to={"/"}
                className="text-secondary underline underline-offset-4 hidden md:inline-block"
              >
                Back to website
              </Link>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <div className="flex items-center gap-1 bg-primary px-4 text-light rounded-md  ">
                    <p>{auth?.userName}</p>
                    <FaAngleDown size={20} />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item>
                    <Link
                      to={"/teas/profile"}
                      className="flex items-center gap-2"
                    >
                      <CgProfile />
                      <p>Profile</p>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      onClick={() => {
                        signOut();
                      }}
                      className="flex items-center gap-2"
                    >
                      <BiLogOut />
                      <p>Logout</p>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>

          <main className=" h-[100vh] overflow-y-auto no-scrollbar pt-[100px] px-4 ">
            <Outlet />
          </main>
          {/* <footer>
            <p className="text-center text-primary py- bg-gray-300 bg-opacity-20 ">
              Copy rights &copy; Agape writing services {date.getFullYear()}{" "}
            </p>
          </footer> */}
        </div>
      </div>
    </div>
  );
}

export default HESIDashboard;
