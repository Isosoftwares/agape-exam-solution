import React from "react";
import {
  FaBook,
  FaPenFancy,
  FaClipboardList,
  FaPlusCircle,
  FaArrowRight,
  FaStar,
  FaGraduationCap,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import teas from "../../assets/graphics/teas.jpeg";
import hesi from "../../assets/graphics/hesi.jpeg";
import ged from "../../assets/graphics/ged.jpeg";

function SelectDashBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from;

  const handleNavigate = (dashboardLink, service) => {
    localStorage.setItem("activeDashboard", dashboardLink);
    if (service === "OTHER") {
      navigate(dashboardLink);
    } else if (from === "signup") {
      navigate("/subscribe", { state: { service: service } });
    } else {
      navigate(dashboardLink);
    }
  };

  const services = [
    {
      id: "GED",
      title: "GED",
      description: "General Educational Development Test Prep",
      image: ged,
      icon: FaGraduationCap,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      route: "/ged",
    },
    {
      id: "TEAS",
      title: "TEAS",
      description: "Test of Essential Academic Skills",
      image: teas,
      icon: FaBook,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      route: "/teas",
    },
    {
      id: "HESI",
      title: "HESI",
      description: "Health Education Systems Incorporated",
      image: hesi,
      icon: FaClipboardList,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      route: "/hesi",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Choose Service
          </h1>
          <p className="text-xl text-dark/70 max-w-2xl mx-auto">
            Select the service that matches your academic goals and start your
            journey to success
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => handleNavigate(service.route, service.id)}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-secondary/30 transform hover:-translate-y-2"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <IconComponent className="w-full h-full text-primary" />
                </div>

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-dark/60 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center gap-3">
                      <span>Get Started</span>
                      <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-secondary/30 transition-colors duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Other Services Card */}
        <div className="max-w-4xl mx-auto">
          <div
            onClick={() => handleNavigate("/client", "OTHER")}
            className="group relative bg-gradient-to-r from-primary to-primary/90 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64">
                <FaPlusCircle className="w-full h-full text-white" />
              </div>
            </div>

            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaPlusCircle className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Other Services
                  </h3>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    Need help with writing services, assignments, essays,
                    research papers, or custom academic support? We've got you
                    covered.
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      "Writing Services",
                      "Custom Essays",
                      "Research Papers",
                      "Assignment Help",
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-white/80"
                      >
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="flex-shrink-0">
                  <button className="bg-secondary text-primary font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                    <div className="flex items-center gap-3">
                      <span>Explore Services</span>
                      <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <p className="text-dark/60">
            Need help choosing?{" "}
            <span className="text-secondary font-semibold cursor-pointer hover:underline">
              Contact our support team
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectDashBoard;
