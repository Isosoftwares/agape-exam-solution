import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import teas from "../assets/graphics/teas.jpg";
import PaperCard from "./components/PaperCard";
import { Loader, Pagination } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import subjects from "../utils/subjects";
import CTA from "./components/CTA";
import Subscriptions from "./components/Subscriptions";
import { Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";

function TEasPracticeTest() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [examType, setExamType] = useState("TEAS");
  const [subscriptionType, setSubscriptionType] = useState("");
  const axios = useAxiosPrivate();

  const getPapers = () => {
    return axios.get(
      `/test-paper?page=${activePage}&perPage=${perPage}&examType=${examType}&subscriptionType=${subscriptionType}&subject=${selectedSubject}`
    );
  };

  const {
    isLoading: loadingPapers,
    data: papersData,
    refetch: refetchPappers,
    isRefetching: refetchingpapers,
    isError: errorGetingPapers,
    error,
  } = useQuery({
    queryKey: [`teas-papers--`],
    queryFn: getPapers,
  });

  const totalPages = Math.ceil(papersData?.data?.count / perPage);

  useEffect(() => {
    refetchPappers();
  }, [perPage, activePage, examType, subscriptionType, selectedSubject]);

  return (
    <div className="min-h-screen bg-light">
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-primary text-light py-20 overflow-hidden pt-[90px]">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-secondary text-sm font-medium">
              <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
              <span>TEAS Test Preparation</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-3xl font-black leading-tight">
                Excel in Your TEAS Exam
              </h1>

              <p className="text-xl text-tertiary max-w-3xl mx-auto leading-relaxed">
                Prepare with the most precise questions, comprehensive answer
                explanations, and gain the
                <span className="text-secondary font-semibold">
                  {" "}
                  assurance of a pass guarantee{" "}
                </span>
                in your TEAS exams
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                onClick={() => {
                  localStorage.setItem("dotestCalculator", "TEAS");
                }}
                to="/my-test"
                className="group relative inline-flex items-center bg-secondary hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25 text-lg"
              >
                <span className="relative z-10">Take My TEAS Exam</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About TEAS Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-primary mb-6">
                  Why Choose Our TEAS Program?
                  <div className="w-16 h-1 bg-secondary rounded-full mt-3"></div>
                </h2>

                <p className="text-dark/80 text-lg leading-relaxed mb-8">
                  We are dedicated to delivering top-tier questions and
                  explanations for students. This dedication has earned the
                  trust of over a million nurses for their nursing entrance exam
                  prep. Now, you have the opportunity to utilize our practice
                  questions for the TEAS TEST.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Extensive review guides encompassing every subject area",
                  "Detailed explanations to enhance comprehension",
                  "Progress monitoring to evaluate performance and pinpoint areas needing improvement",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-dark font-medium text-lg leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative lg:order-last">
              <div className="bg-tertiary/20 rounded-3xl p-8">
                <img
                  loading="lazy"
                  src={teas}
                  alt="TEAS Student"
                  className="w-full h-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscriptions Section */}
      <section id="subscriptions" className="py-16 bg-tertiary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <Subscriptions close={false} inModal={false} serviceName="TEAS" />
        </div>
      </section>

      {/* Practice Tests Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-primary mb-4">
              TEAS Practice Tests
            </h2>
            <p className="text-dark/70 text-lg max-w-2xl mx-auto">
              Master your TEAS exam with our comprehensive practice test
              collection
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-xl font-bold text-primary">Filter Tests:</h3>
              <select
                className="px-4 py-3 rounded-xl border-2 border-primary/20 focus:border-secondary focus:outline-none bg-white text-dark font-medium min-w-[160px]"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "All") {
                    setSubscriptionType("");
                  } else {
                    setSubscriptionType(value);
                  }
                  setPage(1);
                }}
                value={subscriptionType}
              >
                <option value="All">All Tests</option>
                <option value="Free">Free Tests</option>
                <option value="Premium">Premium Tests</option>
              </select>
            </div>
          </div>

          {/* Subject Filters */}
          <div className="mb-12">
            <div className="bg-tertiary/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-primary mb-4">
                Filter by Subject:
              </h4>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedSubject === ""
                      ? "bg-primary text-light shadow-lg"
                      : "bg-white text-primary border-2 border-primary/20 hover:border-secondary hover:text-secondary"
                  }`}
                  onClick={() => setSelectedSubject("")}
                >
                  All Subjects
                </button>
                {subjects()?.TEAS?.map((item, index) => (
                  <button
                    key={index}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedSubject === item
                        ? "bg-primary text-light shadow-lg"
                        : "bg-white text-primary border-2 border-primary/20 hover:border-secondary hover:text-secondary"
                    }`}
                    onClick={() => setSelectedSubject(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="min-h-[400px]">
            {loadingPapers || refetchingpapers ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center space-y-4">
                  <Loader color="#002159" size="lg" />
                  <p className="text-dark/60">Loading practice tests...</p>
                </div>
              </div>
            ) : papersData?.data?.message ? (
              <div className="text-center py-20">
                <div className="bg-tertiary/20 rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-dark text-lg">
                    {papersData?.data?.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {papersData?.data?.testPapers?.map((item, index) => (
                  <div
                    key={index}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <PaperCard paper={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Pagination
              total={totalPages || 0}
              page={activePage}
              color="#002159"
              onChange={setPage}
              size="md"
            />

            <div className="flex items-center space-x-3">
              <span className="text-dark/70">Show</span>
              <select
                className="px-4 py-2 rounded-lg border-2 border-primary/20 focus:border-secondary focus:outline-none bg-white text-dark font-medium"
                onChange={(e) => {
                  setPerPage(e.target.value);
                  setPage(1);
                }}
                value={perPage}
              >
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span className="text-dark/70">tests per page</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />

      <Footer />
    </div>
  );
}

export default TEasPracticeTest;
