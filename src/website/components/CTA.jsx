import React from "react";
import whatsappNumber from "../../utils/whatsappNumber";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function CTA() {
  const { auth } = useAuth();
  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would like to inquire about your services. "
  );

  return (
    <div className="relative py-20 px-4 lg:px-8 overflow-hidden">
      {/* Background with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-dark"></div>

      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-secondary text-sm font-medium shadow-lg mb-6">
            <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
            <span>Limited Time Offer</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-light leading-tight">
              Pass your entrance exams with
              <span className="block text-transparent bg-gradient-to-r from-secondary via-secondary to-tertiary bg-clip-text">
                Confidence In Just 4 Weeks
              </span>
            </h2>

            {/* Animated underline */}
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-secondary to-tertiary rounded-full"></div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-tertiary max-w-2xl mx-auto leading-relaxed font-light">
            Your success is our priority. Join thousands of students who have
            achieved their dreams with our expert guidance.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">99%</div>
              <div className="text-sm text-tertiary">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                Unlimited
              </div>
              <div className="text-sm text-tertiary">
                Access Premium Practice Test{" "}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-sm text-tertiary">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <Link
              to={`${auth?.userId ? "/client/create-order" : "/signup"}`}
              state={{ dashboardPath: `/client` }}
              className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-500 hover:to-secondary text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <span className="relative z-10 text-lg">
                {auth?.userId ? "Order Now" : "Get Started Today"}
              </span>
            </Link>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${whatsappNumber()}?text=${defaultMessage}`}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-secondary/50 text-light hover:text-secondary font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/20 flex items-center space-x-3"
            >
              <FaWhatsapp className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-lg">Chat on WhatsApp</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-12 text-sm text-tertiary">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Money Back Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Expert Support Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
