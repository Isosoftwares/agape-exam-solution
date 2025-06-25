import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { MdVerified, MdOutlineVerifiedUser } from "react-icons/md";
import { Slide } from "react-awesome-reveal";

function OnlineExamHelp() {
  return (
    <div className="">
      <NavBar />
      <div className="">
        <div class=" pt-[70px] pb-[30px] bg-hero  bg-cover bg-no-repeat ">
          <div class=" text-center mx-auto py-5   ">
            <Slide direction="up" cascade>
              <div>
                <h1 class="text-light text-3xl font-bold leading-tight mb-5">
                  Online exam help Services
                </h1>
              </div>
            </Slide>
          </div>
        </div>
        <div className="mt-[15px] px-4 md:px-24 ">
          <p className="text-start  font-bold text-2xl pb-4 text-primary ">
            Online exam help
          </p>
          <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Slide>
              <div className="space-y-6">
                <p className="text-red-500 font-semibold">
                  For all your online exams needs
                </p>
                <h1 className="text-4xl font-bold text-primary capitalize">
                  The ultimate success in your online exams.
                </h1>
                <p className="">
                  All you need all in on stop. Pass your exams with our help.
                  Ease all acadamic pressure with our services. Get started
                  create account and place an order or contacts us and get
                  everything in line.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-zinc-700 gap-2  ">
                    <MdVerified color="#002159" />
                    Timely delivery.
                  </li>
                  <li className="flex items-center text-zinc-700 gap-2  ">
                    <MdVerified color="#002159" />
                    Best Quality work
                  </li>
                  <li className="flex items-center text-zinc-700 gap-2  ">
                    <MdVerified color="#002159" />
                    Professional services.
                  </li>
                  <li className="flex items-center text-zinc-700 gap-2  ">
                    <MdVerified color="#002159" />
                    24/7 support
                  </li>
                </ul>
                <div className="flex gap-3">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg">
                    Place Order
                  </button>
                  <button className="bg-secondary text-white px-6 py-3 rounded-lg capitalize">
                    Chat with Us
                  </button>
                </div>
              </div>
            </Slide>
            <Slide direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white  p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center bg-red-500 text-white rounded-full w-12 h-12 mb-4">
                    <MdOutlineVerifiedUser size={25} />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Ged Exams
                  </h3>
                  <p className="text-zinc-700  mt-2">Exam description</p>
                </div>
                <div className="bg-white  p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-12 h-12 mb-4">
                    <MdOutlineVerifiedUser size={25} />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Teas exams
                  </h3>
                  <p className="text-zinc-700  mt-2">Exam explanation</p>
                </div>
                <div className="bg-white  p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center bg-green-500 text-white rounded-full w-12 h-12 mb-4">
                    <MdOutlineVerifiedUser size={25} />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Hesi
                  </h3>
                  <p className="text-zinc-700  mt-2">description</p>
                </div>
                <div className="bg-white  p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center bg-purple-500 text-white rounded-full w-12 h-12 mb-4">
                    <MdOutlineVerifiedUser size={25} />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Entrance exams , straightliner and more
                  </h3>
                  <p className="text-zinc-700  mt-2"></p>
                </div>
              </div>
            </Slide>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OnlineExamHelp;
