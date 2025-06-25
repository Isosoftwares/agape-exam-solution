import React from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";
import classimage from "../assets/graphics/assingment.jpg";
import ess from "../assets/graphics/essay.jpg";
import { MdVerified, MdOutlineVerifiedUser } from "react-icons/md";
import Footer from "../components/Footer";
import { Link as LinkS } from "react-scroll";
import useAuth from "../hooks/useAuth";

function Otherservices() {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-light">
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-primary text-light py-20 overflow-hidden pt-[80px] ">
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
              <span className="">Academic Support Services</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-3xl lg:text-3xl font-black leading-tight">
                Complete Academic
                <span className="block text-secondary text-4xl md:text-3xl lg:text-3xl">
                  Support Services
                </span>
              </h1>

              <p className="text-xl text-tertiary max-w-3xl mx-auto leading-relaxed">
                From online classes to assignments and exams - we provide
                comprehensive academic support to help you succeed in every
                aspect of your education
              </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex flex-wrap justify-center gap-4 ">
              <LinkS
                activeClass="active"
                to="classes"
                spy={true}
                smooth={true}
                offset={-65}
                className="group cursor-pointer bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Online Classes Help
              </LinkS>

              <LinkS
                activeClass="active"
                to="exams"
                spy={true}
                smooth={true}
                offset={-65}
                className="group cursor-pointer bg-secondary hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Online Exams Help
              </LinkS>

              <LinkS
                activeClass="active"
                to="assignments"
                spy={true}
                smooth={true}
                offset={-65}
                className="group cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Assignments & Essays
              </LinkS>
            </div>
          </div>
        </div>
      </section>

      {/* Online Classes Service */}
      <section id="classes" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-pink-500/10 rounded-full text-pink-500 text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  <span>Online Classes Support</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-primary mb-6">
                  We Take Your Online Classes On Your Behalf
                  <div className="w-16 h-1 bg-pink-500 rounded-full mt-3"></div>
                </h2>

                <h3 className="text-2xl font-bold text-pink-500 mb-6">
                  Catch Up With Your Online Classes
                </h3>

                <p className="text-dark/80 text-lg leading-relaxed">
                  Agape Exam Solutions specializes in providing dedicated
                  support for your online classes. Our experienced tutors tailor
                  their assistance to meet your specific needs, helping you
                  grasp complex concepts, stay on top of assignments, and excel
                  in your coursework.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  "Personalized guidance for each student",
                  "Flexible tutoring options to fit your schedule",
                  "Expert help with complex concepts",
                  "Assignment and coursework support",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <MdVerified className="text-pink-500" size={16} />
                    </div>
                    <p className="text-dark font-medium">{feature}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  to={`${auth?.userId ? "/client/create-order" : "/signup"}`}
                  state={{ dashboardPath: `/client/create-order` }}
                  className="group inline-flex items-center bg-primary hover:bg-dark text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span>Order Now</span>
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

            {/* Image */}
            <div className="relative">
              <div className="bg-pink-500/10 rounded-3xl p-8">
                <img
                  src={classimage}
                  loading="lazy"
                  alt="Online class service"
                  className="w-full h-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Exams Help */}
      <section id="exams" className="py-20 bg-tertiary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-red-500/10 rounded-full text-red-500 text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Exam Support Services</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-primary mb-6">
                  Ultimate Success in Your Online Exams
                  <div className="w-16 h-1 bg-red-500 rounded-full mt-3"></div>
                </h2>

                <h3 className="text-xl font-semibold text-red-500 mb-6">
                  For All Your Proctored and Non-Proctored Exam Needs
                </h3>

                <p className="text-dark/80 text-lg leading-relaxed mb-8">
                  We help students excel in their CNA, StraighterLine courses,
                  life insurance exams, ACCUPLACER, real estate exams, ATI
                  exams, and Penn Foster courses through personalized study
                  plans, expert tutoring, and comprehensive materials.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  "Timely delivery",
                  "Best Quality work",
                  "Professional services",
                  "24/7 support",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <MdVerified className="text-primary" size={16} />
                    </div>
                    <span className="text-dark font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  to={`${auth?.userId ? "/client/create-order" : "/signup"}`}
                  state={{ dashboardPath: `/client/create-order` }}
                  className="group inline-flex items-center bg-primary hover:bg-dark text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span>Place Order</span>
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

            {/* Exam Types Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  name: "ACCUPLACER",
                  color: "bg-red-500",
                  icon: MdOutlineVerifiedUser,
                },
                {
                  name: "LSAT Exams",
                  color: "bg-blue-500",
                  icon: MdOutlineVerifiedUser,
                },
                {
                  name: "Real Estate All States",
                  color: "bg-green-500",
                  icon: MdOutlineVerifiedUser,
                },
                {
                  name: "Life Insurance",
                  color: "bg-purple-500",
                  icon: MdOutlineVerifiedUser,
                },
                {
                  name: "CNA Exam",
                  color: "bg-cyan-500",
                  icon: MdOutlineVerifiedUser,
                },
                {
                  name: "ATI Exams",
                  color: "bg-orange-500",
                  icon: MdOutlineVerifiedUser,
                },
              ].map((exam, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-12 h-12 ${exam.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <exam.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-primary">
                    {exam.name}
                  </h3>
                  <p className="text-dark/60 text-sm mt-2">
                    Expert support available
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assignments & Essays */}
      <section id="assignments" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-500 text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
              <span>Writing Services</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mb-4">
              Assignments | Essays | Discussions | Projects Help
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="bg-cyan-500/10 rounded-3xl p-8">
                <img
                  src={ess}
                  loading="lazy"
                  alt="Assignment service"
                  className="w-full h-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-red-500 mb-4">
                  Ace Your Work With Our Writing Services
                </h3>

                <h4 className="text-3xl lg:text-4xl font-black text-primary mb-6">
                  Best Quality Writing Services
                  <div className="w-16 h-1 bg-cyan-500 rounded-full mt-3"></div>
                </h4>

                <p className="text-dark/80 text-lg leading-relaxed mb-8">
                  Urgent homework or assignments? Worry less, place your order
                  and get started on your paper. Get solutions delivered timely
                  within your deadline.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  "Timely delivery",
                  "Best Quality work",
                  "Professional services",
                  "24/7 support",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <MdVerified className="text-primary" size={16} />
                    </div>
                    <span className="text-dark font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  to={`${auth?.userId ? "/client/create-order" : "/signup"}`}
                  state={{ dashboardPath: `/client/create-order` }}
                  className="group inline-flex items-center bg-primary hover:bg-dark text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span>Order Now</span>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Otherservices;
