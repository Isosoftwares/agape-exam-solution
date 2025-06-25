import React from "react";
import hero from "../../assets/graphics/newhero.jpg";
import { FaWhatsapp, FaArrowRight, FaStar } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import whatsappNumber from "../../utils/whatsappNumber";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { Slide } from "react-awesome-reveal";

function Hero() {
  const { auth } = useAuth();

  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would like to inquire about your services."
  );

  return (
    <div className="relative bg-gradient-to-br from-primary via-primary/95 to-dark overflow-hidden lg:pt-[60px] xl:pt-[20px] ">
      {/* Modern geometric background */}
      <div className="absolute inset-0">
        {/* Static gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-secondary/20 to-tertiary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-tertiary/15 to-secondary/15 rounded-full blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Modern badge with glassmorphism */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-secondary text-sm font-medium shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
              <span className="ml-3">Transform Your Future</span>
            </div>

            {/* Main heading with modern typography */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-light leading-tight">
                Unlock your potential with our comprehensive
                <span className="block text-3xl md:text-4xl lg:text-4xl text-transparent bg-gradient-to-r from-secondary via-secondary to-tertiary bg-clip-text">
                  GED, TEAS & HESI
                </span>
                <span className="text-3xl md:text-4xl lg:text-4xl font-light text-gray-300">
                  preparation programs. Your success story starts here.
                </span>
              </h1>

              {/* Static underline */}
              <div className="w-24 h-1 bg-gradient-to-r from-secondary to-tertiary rounded-full"></div>
            </div>

            {/* Stats or features */}
            <div className="flex flex-wrap gap-6 py-2">
              <div className="flex items-center space-x-2 text-light">
                <FaCircleCheck className="text-secondary w-5 h-5" />
                <span className="text-sm font-medium">Expert Guidance</span>
              </div>
              <div className="flex items-center space-x-2 text-light">
                <FaCircleCheck className="text-secondary w-5 h-5" />
                <span className="text-sm font-medium">Proven Results</span>
              </div>
              <div className="flex items-center space-x-2 text-light">
                <FaStar className="text-secondary w-5 h-5" />
                <span className="text-sm font-medium">5-Star Rated</span>
              </div>
            </div>

            {/* Modern button grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <Link
                to="/ged-practice-test-papers"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">GED Prep</span>
              </Link>

              <Link
                to="/teas-practice-test-papers"
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">TEAS Prep</span>
              </Link>

              <Link
                to="/hesi-practice-test-papers"
                className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-400 hover:to-secondary text-white px-6 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">HESI Prep</span>
              </Link>
            </div>

            {/* CTA buttons with modern design */}
            <div className="flex flex-col sm:flex-row gap-4 ">
              <Link
                to="/my-test"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/30"
              >
                <span className="mr-3">Exam Help</span>
                <FaArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>

              <Link
                to="/other-services"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-secondary/50 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <span className="mr-3">Explore Services</span>
                <FaArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              {/* Floating elements around image */}
              {/* <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary/30 to-tertiary/30 rounded-2xl blur-xl"></div> */}
              {/* <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-tertiary/30 to-secondary/30 rounded-full blur-xl"></div> */}

              {/* Main image container with glassmorphism */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
                <img
                  src={hero}
                  alt="Educational Excellence"
                  className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 rounded-2xl"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ✨ Top Rated
                </div>
              </div>

              {/* Achievement badges */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl hidden lg:block">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">99%</div>
                  <div className="text-xs text-gray-300">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
