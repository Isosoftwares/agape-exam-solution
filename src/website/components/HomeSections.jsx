import React from "react";
import teas from "../../assets/graphics/teas.jpg";
import hesi from "../../assets/graphics/hesi.jpg";
import ged from "../../assets/graphics/ged.jpg";
import { Rating } from "@mantine/core";
import { Slide, Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

const HomeSections = () => {
  return (
    <div className="bg-gradient-to-b from-light to-tertiary/20">
      {/* GED */}
      <div className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-xl transform scale-110"></div>
              <div className="relative bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/70 transition-all duration-500">
                <img
                  loading="lazy"
                  src={ged}
                  alt="GED Student"
                  className="w-full h-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6">
                  GED
                  <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mt-2"></div>
                </h2>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Thorough educational guides spanning all topics.
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Elaborate explanations to facilitate deeper understanding.
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Progress assessment to track achievements and highlight
                      areas for enhancement.
                    </p>
                  </li>
                </ul>

                <Link
                  to="/ged-practice-test-papers"
                  className="group relative overflow-hidden inline-flex items-center bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-primary text-light font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">View More Details</span>
                </Link>
              </div>

              {/* Testimonial */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-tertiary/30 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-tertiary to-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">J</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-primary">Julie L.</p>
                        <p className="text-sm text-dark/70">Practitioner</p>
                      </div>
                      <Rating value={5} readOnly size="sm" />
                    </div>
                    <blockquote className="text-dark leading-relaxed italic">
                      "Thanks to Agape Smart Solutions, I excelled in my GED
                      test with outstanding results! Their exceptional resources
                      and insightful assistance truly set me up for success."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEAS */}
      <div className="py-20 px-4 lg:px-8 bg-gradient-to-r from-tertiary/10 to-secondary/5">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6">
                  TEAS
                  <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mt-2"></div>
                </h2>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Extensive review guides encompassing every subject area
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Detailed explanations to enhance comprehension.
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Progress monitoring to evaluate performance and pinpoint
                      areas needing improvement.
                    </p>
                  </li>
                </ul>

                <Link
                  to="/teas-practice-test-papers"
                  className="group relative overflow-hidden inline-flex items-center bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-primary text-light font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">View More Details</span>
                </Link>
              </div>

              {/* Testimonial */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary/30 to-secondary/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">J</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-primary">
                          Jasmine Gonzalez
                        </p>
                        <p className="text-sm text-dark/70">Nurse</p>
                      </div>
                      <Rating value={5} readOnly size="sm" />
                    </div>
                    <blockquote className="text-dark leading-relaxed italic">
                      "Thanks to Agape Smart Solutions, I aced my TEAS 7 test
                      with flying colors! Their comprehensive resources and
                      expert guidance made all the difference."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative group order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-xl transform scale-110"></div>
              <div className="relative bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/70 transition-all duration-500">
                <img
                  loading="lazy"
                  src={teas}
                  alt="TEAS Student"
                  className="w-full h-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HESI */}
      <div className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-xl transform scale-110"></div>
              <div className="relative bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/70 transition-all duration-500">
                <img
                  loading="lazy"
                  src={hesi}
                  alt="HESI Student"
                  className="w-full h-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6">
                  HESI
                  <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mt-2"></div>
                </h2>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Complete subject guides covering every topic.
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Comprehensive explanations to improve understanding.
                    </p>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-dark font-medium leading-relaxed">
                      Progress tracking to evaluate performance and identify
                      improvement areas.
                    </p>
                  </li>
                </ul>

                <Link
                  to="/hesi-practice-test-papers"
                  className="group relative overflow-hidden inline-flex items-center bg-gradient-to-r from-primary to-dark hover:from-dark hover:to-primary text-light font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">View More Details</span>
                </Link>
              </div>

              {/* Testimonial */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-tertiary/30 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-tertiary to-dark/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">D</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-primary">Dave Freman</p>
                        <p className="text-sm text-dark/70">RN Nurse</p>
                      </div>
                      <Rating value={4} readOnly size="sm" />
                    </div>
                    <blockquote className="text-dark leading-relaxed italic">
                      "A huge shoutout to Agape Exam Solutions for helping me
                      achieve high scores on my HESI test! Their expert
                      directions and amazing resources truly made a difference."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSections;
