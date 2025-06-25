import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import classimage from "../assets/graphics/class.avif";
import { Link } from "react-router-dom";
import { Slide } from "react-awesome-reveal";

function OnlineClassHelp() {
  return (
    <div className="">
      <NavBar />
      <div className="">
        <div class=" pt-[60px] pb-[30px] bg-hero  bg-cover bg-no-repeat ">
          <div class=" text-center mx-auto py-5   ">
            <Slide direction="up" cascade>
              <div>
                <h1 class="text-light text-3xl font-bold leading-tight mb-5">
                  Online class help Services
                </h1>
              </div>
            </Slide>
          </div>
        </div>
        <div className="bg-onlineclass bg-cover bg-blend-overlay bg-[#d1ccf0] py-16 lg:px-[100px]">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2">
              <Slide>
                <h2 className="text-pink-500 font-semibold">
                  We do your online classes on you behalf
                </h2>
                <h3 className="text-4xl font-bold text-zinc-900 mt-2">
                  Get reliable online classes service
                </h3>
                <p className="text-zinc-700 mt-4">
                  At Agape Smart Solutions, we specialize in providing
                  dedicated support for your online classes. Our experienced
                  tutors tailor their assistance to meet your specific needs,
                  helping you grasp complex concepts, stay on top of
                  assignments, and excel in your coursework. With personalized
                  guidance and flexible tutoring options, we ensure you achieve
                  your academic goals with confidence and ease.
                </p>
                <div className="mt-6">
                  <Link
                    to={"/signup"}
                    className="bg-primary text-white py-4 px-4 rounded-lg mr-4"
                  >
                    Order Now
                  </Link>
                  <Link
                    to={""}
                    className="border capitalize border-secondary text-primary py-4 px-4 rounded-lg"
                  >
                    Talk to us
                  </Link>
                </div>
              </Slide>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
              <Slide direction="right">
                <img
                  src={classimage}
                  alt="Online class service"
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

export default OnlineClassHelp;
