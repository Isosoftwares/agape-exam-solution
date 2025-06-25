import React from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { PiExamFill } from "react-icons/pi";
import { GrDocumentVerified } from "react-icons/gr";
import { SiSpeedtest } from "react-icons/si";
import { Link } from "react-router-dom";

function HeroCards() {
  return (
    <div className="px-10 md:px-[100px]  pb-[40px]  ">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ">
        <div class="px-3  py-8 bg-gray-100 rounded-md hover:bg-secondary hover:bg-opacity-10 hover:scale-105 ease-in-out duration-300 ">
          <div className="flex items-center gap-3 ">
            <div class="bg-indigo-100 rounded-full w-16 h-16 flex justify-center items-center text-indigo-500 shadow-2xl">
              <SiGoogleclassroom size={25} />
            </div>
            <p className="text-lg text-primary font-bold ">Online Classes</p>
          </div>

          <p class="font-light  text-gray-700 mb-3 py-3 px-2 tracking-wider leading-5 ">
            Embark on a seamless learning journey with Agape Smart Solutions.
            Our tailored support ensures mastery of online coursework for
            academic excellence and personal growth.
          </p>
          <Link
            class="text-indigo-500 flex items-center hover:text-indigo-900 hover:bg-indigo-200 hover:rounded-md hover:cursor-pointer px-3 "
            to={"/online-class-help"}
          >
            More about online classes
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div class="px-3  py-8 bg-gray-100 rounded-md hover:bg-secondary hover:bg-opacity-10 hover:scale-105 ease-in-out duration-300 ">
          <div className="flex items-center gap-3 ">
            <div class="bg-green-100 rounded-full w-16 h-16 flex justify-center items-center text-green-500 shadow-2xl">
              <PiExamFill size={30} />
            </div>
            <p className="text-lg text-primary font-bold ">Online Exams</p>
          </div>

          <p class="font-light  text-gray-700 mb-3 py-3 px-2 tracking-wider leading-5 ">
            Navigate online exams confidently with Agape Smart Solutions. Our
            expert guidance ensures thorough preparation and success in
            achieving your academic goals.
          </p>
          <Link
            to={"/online-exam-help"}
            class="text-green-500 flex items-center hover:text-green-900 hover:bg-green-200 hover:rounded-md hover:cursor-pointer px-3 "
          >
            More about online exams
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div class="px-3  py-8 bg-gray-100 rounded-md hover:bg-secondary hover:bg-opacity-10 hover:scale-105 ease-in-out duration-300 ">
          <div className="flex items-center gap-3 ">
            <div class="bg-brown-100 rounded-full w-16 h-16 flex justify-center items-center text-brown-500 shadow-2xl">
              <GrDocumentVerified size={26} />
            </div>
            <p className="text-lg text-primary font-bold ">
              Essays & Assignment{" "}
            </p>
          </div>

          <p class="font-light  text-gray-700 mb-3 py-3 px-2 tracking-wider leading-5 ">
            Excel in your academics with Agape Smart Solutions. Our expert team
            delivers top-notch support for assignments and essays, ensuring your
            success and academic growth.
          </p>
          <Link to={'/essay-help'}
            class="text-brown-500 flex items-center hover:text-brown-900 hover:bg-brown-200 hover:rounded-md hover:cursor-pointer px-3 "
            href="/"
          >
            More about assignments
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div class="px-3  py-8 bg-gray-100 rounded-md hover:bg-secondary hover:bg-opacity-10 hover:scale-105 ease-in-out duration-300 ">
          <div className="flex items-center gap-2 ">
            <div class="bg-red-100 rounded-full  h-16 flex justify-center items-center text-red-500 shadow-2xl w-16  md:w-[30%] ">
              <SiSpeedtest size={25} />
            </div>
            <p className="text-lg text-primary font-bold ">
              GED & TEAS practice Test Papers{" "}
            </p>
          </div>

          <p class="font-light  text-gray-700 mb-3 py-3 px-2 tracking-wider leading-5 ">
            Prepare for success with Agape Smart Solutions. Our comprehensive
            practice tests for GED and TEAS exams ensure you're ready to excel
            on exam day.
          </p>
          <Link to={'/ged-practice-test-papers'}
            class="text-red-500 flex items-center hover:text-red-900 hover:bg-red-200 hover:rounded-md hover:cursor-pointer px-3 "
          >
            More about test papers
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroCards;
