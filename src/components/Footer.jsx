import React from "react";
import Logo from "../assets/graphics/mainlogo.png";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaSquareInstagram, FaFacebook } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import whatsappNumber from "../utils/whatsappNumber";
import { MdOutlineEmail } from "react-icons/md";

function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would like to inquire about your services. "
  );

  return (
    <footer className="relative bg-gradient-to-br from-primary to-primary  text-light overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        {/* <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div> */}
        {/* <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl"></div> */}

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Logo & Description Section */}
            <div className="lg:col-span-5 ">
              <Link to="/" className="inline-block  group">
                <img
                  src={Logo}
                  className="h-[80px] w-auto  object-contain transition-transform duration-300 group-hover:scale-105"
                  alt="Agape Exam Solutions Logo"
                />
              </Link>

              <div className="space-y-4">
                <p className="text-tertiary text-lg leading-relaxed max-w-md">
                  Empowering students to achieve academic excellence through
                  expert guidance and comprehensive test preparation.
                </p>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span className="text-sm text-tertiary">
                      Trusted by 10,000+ students
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-xl font-bold text-light border-b-2 border-secondary pb-2 inline-block">
                Get In Touch
              </h3>

              <div className="space-y-4">
                <a
                  href="mailto:support@agapesmartsolutions.com"
                  className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MdOutlineEmail size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-tertiary text-sm">Email Us</p>
                    <p className="text-light font-medium">
                      support@agapesmartsolutions.com
                    </p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber()}?text=${defaultMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaWhatsapp size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-tertiary text-sm">WhatsApp</p>
                    <p className="text-light font-medium">+15109994520</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-light border-b-2 border-secondary pb-2 inline-block">
                Quick Links
              </h3>

              <nav className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "GED", path: "/ged-practice-test-papers" },
                  { name: "TEAS", path: "/teas-practice-test-papers" },
                  { name: "HESI", path: "/hesi-practice-test-papers" },
                  { name: "Other Services", path: "/other-services" },
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="group flex items-center space-x-3 text-tertiary hover:text-secondary transition-colors duration-300"
                  >
                    <IoIosArrowForward
                      className="text-secondary group-hover:translate-x-1 transition-transform duration-300"
                      size={16}
                    />
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Media Section */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-light border-b-2 border-secondary pb-2 inline-block">
                Follow Us
              </h3>

              <div className="space-y-4">
                <p className="text-tertiary text-sm">
                  Stay connected for updates and success stories
                </p>

                <div className="flex flex-col space-y-3">
                  <a
                    href="https://www.instagram.com/agape_writing_services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaSquareInstagram size={20} className="text-white" />
                    </div>
                    <span className="text-light font-medium">Instagram</span>
                  </a>

                  <a
                    href="https://www.facebook.com/collegegradesbooster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaFacebook size={20} className="text-white" />
                    </div>
                    <span className="text-light font-medium">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-dark/50">
          <div className="container mx-auto px-6 py-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-tertiary text-sm">
                Copyright © {year} Agape Smart Solutions. All rights reserved.
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  to="/"
                  className="text-tertiary hover:text-secondary transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/"
                  className="text-tertiary hover:text-secondary transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-tertiary">Secure & Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
