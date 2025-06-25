import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TakeMyGED from "../GED-Dashboard/pages/TakeMyGED";
import TakeMyTEAS from "../TEAS-Dashboard/pages/TakeMyTEAS";
import TakeMyHESI from "../HESI-Dashboard/pages/TakeMyHESI";

function DoMyTest() {
  const [testType, setTestType] = useState(
    localStorage.getItem("dotestCalculator") || "GED"
  );

  const examTypes = [
    {
      id: "GED",
      name: "GED Exam",
      description: "General Educational Development",
      icon: "🎓",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      id: "TEAS",
      name: "TEAS Exam",
      description: "Test of Essential Academic Skills",
      icon: "🏥",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "HESI",
      name: "HESI Exam",
      description: "Health Education Systems Inc.",
      icon: "💉",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-light">
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-primary text-light pb-20 overflow-hidden pt-[80px] ">
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
              <span>Exam Assistance Service</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <p className="text-xl text-tertiary max-w-3xl mx-auto leading-relaxed">
                You have a GED, TEAS or HESI exam upcoming? Tell us about it and
                get assistance with
                <span className="text-secondary font-semibold">
                  {" "}
                  pass guarantee!
                </span>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 ">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-secondary text-lg">✓</span>
                </div>
                <span className="text-tertiary">Pass Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-secondary text-lg">🏆</span>
                </div>
                <span className="text-tertiary">Expert Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-secondary text-lg">⚡</span>
                </div>
                <span className="text-tertiary">Quick Turnaround</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Exam Type Selection */}
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Selection Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-primary">
                Select Your Exam Type
              </h2>
              <p className="text-dark/70 text-lg">
                Choose the exam you need assistance with to get started
              </p>
            </div>

            {/* Exam Type Cards - Minimal */}
            <div className="flex flex-wrap justify-center gap-4">
              {examTypes.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setTestType(exam.id)}
                  className={`group px-8 py-2 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    testType === exam.id
                      ? "border-primary bg-primary text-light shadow-lg"
                      : "border-tertiary/90 bg-white text-dark hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Icon */}

                    {/* Text */}
                    <div className="text-left">
                      <h3 className="font-bold">{exam.name}</h3>
                    </div>

                    {/* Selected Indicator */}
                    {testType === exam.id && (
                      <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center ml-2">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Section */}
          {testType && (
            <div className="max-w-6xl mx-auto mt-16">
              {/* Form Header */}
              <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-primary">
                  Tell Us About Your {testType} Exam
                </h3>
                <p className="text-dark/70 mt-2">
                  Fill out the form below and our experts will get back to you
                  with a customized solution
                </p>
              </div>

              {/* Dynamic Form Container */}
              <div className="bg-white rounded-xl border-2 border-tertiary/20 shadow-sm overflow-hidden">
                <div className="">
                  {testType === "GED" && <TakeMyGED />}
                  {testType === "TEAS" && <TakeMyTEAS />}
                  {testType === "HESI" && <TakeMyHESI />}
                </div>
              </div>
            </div>
          )}

          {/* No Selection State */}
          {!testType && (
            <div className="max-w-2xl mx-auto mt-16 text-center">
              <div className="bg-tertiary/10 rounded-2xl p-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-primary text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  Select an Exam Type to Get Started
                </h3>
                <p className="text-dark/70">
                  Choose your exam type above to access the request form and get
                  expert assistance with your upcoming test.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-tertiary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-primary mb-12">
              Why Choose Our Exam Assistance?
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Pass Guarantee",
                  description: "We guarantee your success or your money back",
                },
                {
                  icon: "👨‍🏫",
                  title: "Expert Tutors",
                  description:
                    "Qualified professionals with years of experience",
                },
                {
                  icon: "⏰",
                  title: "24/7 Support",
                  description: "Round-the-clock assistance when you need it",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl">
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-dark/70 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default DoMyTest;
