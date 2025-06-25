import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import classimage from "../assets/graphics/assingmrnt.png";
import { Link } from "react-router-dom";
import { MdVerified, MdOutlineVerifiedUser } from "react-icons/md";
import { Slide } from "react-awesome-reveal";

function EssayHelp() {
  return (
    <div className="">
      <NavBar />
      <div className="">
        <div class=" pt-[60px] pb-[30px] bg-hero  bg-cover bg-no-repeat ">
          <div class=" text-center mx-auto py-5   ">
            <Slide direction="up" cascade>
              <div>
                <h1 class="text-light text-3xl font-bold leading-tight mb-5">
                  Assignments | Essays | Projects etc Service
                </h1>
              </div>
            </Slide>
          </div>
        </div>
        <div className="bg-onlineclass bg-cover bg-blend-overlay bg-[#d1ccf0] py-16">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse gap-6 items-centerh">
            <div className="lg:w-1/2">
              <Slide direction="right">
                <h2 className="text-pink-500 font-semibold capitalize">
                  ace your work with our writing services
                </h2>
                <h3 className="text-4xl font-bold text-zinc-900 mt-2">
                  Best quality writing services
                </h3>
                <p className=" mt-4">
                  Argent homework or assignment? Worry less place your order and
                  get started on you paper. Get solution delivered timely within
                  your deadlines.
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
                <div className="mt-6">
                  <Link
                    to={"/signup"}
                    className="bg-primary text-white py-4 px-4 rounded-lg mr-4"
                  >
                    Order Now
                  </Link>
                  <Link className="border capitalize border-secondary text-secondary py-4 px-4 rounded-lg">
                    Toalk to us
                  </Link>
                </div>
              </Slide>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
              <Slide>
                <img
                  src={classimage}
                  alt="assignment service"
                  className="rounded-lg shadow-lg"
                />
              </Slide>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EssayHelp;
