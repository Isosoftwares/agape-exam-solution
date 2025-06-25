import React, { useState, useEffect } from "react";
import {  Outlet } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Indicator } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import ClientDashNavBar from "./components/ClientDashNavBar";

function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const date = new Date();
  return (
    <div className="">
      <ClientDashNavBar />
      {/* main content*/}
      <div className="pt-[50px] md:pt-[60px] overflow- min-h-[100vh] px-2 md:px-[70px] bg-[#fafaff] ">
        <main className="w-full py-6 px-1 md:px-6 overflow-y-scroll h-[90vh] pb-[200px]">
          <Outlet />
        </main>
      </div>
      <footer>
        <p className="text-center py-3 bg-primary bg-opacity-20 ">
          Copy rights &copy; Agape writing services {date.getFullYear()}{" "}
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
