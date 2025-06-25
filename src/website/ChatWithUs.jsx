import React, { useEffect } from "react";
import { useState } from "react";
import chatIcon from "../assets/graphics/w1.png";
import { useLocation } from "react-router-dom";
import Conversation from "./Conversation";
import { IoCloseSharp } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoLogoWhatsapp } from "react-icons/io";
import logo from "../assets/graphics/newLogo.png";
import { Avatar } from "@mantine/core";
import whatsappNumber from "../utils/whatsappNumber";
import "animate.css";
import { FaWhatsapp } from "react-icons/fa";

function ChatWithUs() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would like to inquire about your services! "
  );

  // function to generate
  function generateRandomString(length) {
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const [clientIdFromStorage, setclientIdFromStorage] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 ${
        (pathname.includes("dashboard") || pathname.includes("login")) &&
        "hidden"
      }`}
    >
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-400 hover:to-secondary text-white px-6 py-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-secondary/25 transition-all duration-300 hover:scale-105 flex items-center space-x-3"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Pulsing indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          <FaWhatsapp size={20} className="relative z-10" />
          <span className="relative z-10 font-semibold text-sm whitespace-nowrap">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Widget */}
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={toggleChat}
          />

          <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-sm md:w-96 bg-white rounded-2xl shadow-2xl  overflow-hidden transition-all duration-300 transform">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary to-primary/70 px-6 py-4">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Agape Logo"
                      className="h-20 w-auto object-contain"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p className="text-tertiary text-sm">Online now</p>
                    </div>
                  </div>
                  {/* <div>
                    <h3 className="text-light font-bold text-lg">
                      Agape Smart Solutions
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p className="text-tertiary text-sm">Online now</p>
                    </div>
                  </div> */}
                </div>

                <button
                  onClick={toggleChat}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <IoCloseSharp color="white" size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="bg-gradient-to-b from-tertiary/20 to-light p-6 min-h-[200px] relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-x-12 translate-y-12"></div>

              {/* Welcome Message */}
              <div className="relative bg-light rounded-2xl rounded-tl-sm p-4 shadow-sm border border-tertiary/30 max-w-[85%]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark text-sm mb-1">
                      Support Team
                    </p>
                    <p className="text-dark text-sm leading-relaxed">
                      👋 Hi there! Welcome to Agape Smart Solutions.
                    </p>
                    <p className="text-dark text-sm leading-relaxed mt-2">
                      How can we help you today?
                    </p>
                  </div>
                </div>

                {/* Message timestamp */}
                <p className="text-xs text-gray-400 mt-3 text-right">
                  Just now
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 bg-light border-t border-tertiary/30">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/${whatsappNumber()}`}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-secondary/90 to-secondary/70 hover:from-green-400 hover:to-secondary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-secondary/25 flex items-center justify-center space-x-3"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                <IoLogoWhatsapp size={24} className="relative z-10" />
                <span className="relative z-10">Continue on WhatsApp</span>
              </a>

              {/* Quick action buttons */}
              {/* <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="text-sm text-dark hover:text-secondary py-2 px-4 border border-tertiary/50 hover:border-secondary/50 rounded-lg transition-colors duration-200">
                  📚 Services
                </button>
                <button className="text-sm text-dark hover:text-secondary py-2 px-4 border border-tertiary/50 hover:border-secondary/50 rounded-lg transition-colors duration-200">
                  💬 Quick Chat
                </button>
              </div> */}
            </div>

            {/* Trust indicators */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Fast Reply</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-dark rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWithUs;
