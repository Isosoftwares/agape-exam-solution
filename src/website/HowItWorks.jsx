import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Slide } from "react-awesome-reveal";

function HowItWorks() {
  return (
    <div className="">
      <NavBar />
      <div class=" pt-[60px] pb-[30px] bg-hero  bg-cover bg-no-repeat ">
        <div class=" text-center mx-auto py-5   ">
          <Slide direction="up" cascade>
            <div>
              <h1 class="text-light text-3xl font-bold leading-tight mb-5">
                How It Works
              </h1>
            </div>
          </Slide>
        </div>
      </div>{" "}
      <div className="h-[600px]">
        //page content
      </div>
      <Footer />
    </div>
  );
}

export default HowItWorks;
