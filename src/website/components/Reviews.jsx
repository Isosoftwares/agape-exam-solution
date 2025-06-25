import React from "react";
import ReviewCard from "./ReviewCard";
import { Rating } from "@mantine/core";
import { Fade, Hinge, Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";

function Reviews() {
  const reviews = [
    {
      name: "Dave Freman",
      comment:
        "Outstanding service! I was struggling with my assignments and falling behind in my classes. This company provided the support I needed to get back on track. Their writers are knowledgeable and always meet deadlines. I've improved my grades significantly thanks to their help!",
      stars: 5,
      date: "2025-04-15",
      profile: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Jane Smith",
      comment:
        "The practice tests were incredibly helpful for my TEAS exam prep. Highly recommend!",
      stars: 4,
      date: "2024-01-22",
      profile: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Alice Johnson",
      comment:
        "Exceptional experience from start to finish. The team at agape writing is dedicated to helping students succeed. They helped me ace my classes and understand complex topics. Their attention to detail and commitment to quality are unmatched. I'll definitely be using their services again.",
      stars: 5,
      date: "2025-02-10",
      profile: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "Michael Brown",
      comment:
        "Best decision I ever made! I was overwhelmed with my coursework, and this company came to my rescue. They helped me pass my exams and complete my assignments on time. The writers are friendly, responsive, and truly care about their clients' success. Highly recommend to any student in need of academic assistance.",
      stars: 3,
      date: "2024-04-05",
      profile: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Emily Davis",
      comment:
        "Fantastic service! I was skeptical at first, but Agape Exam Solutions exceeded my expectations. Their writers are experts in their fields and provide top-notch work. I was able to pass my exams and achieve high grades in my classes. Their support has been invaluable to my academic journey.",
      stars: 5,
      date: "2024-02-28",
      profile: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      name: "Chris Wilson",
      comment:
        "Agape Exam Solutions is a game-changer! I was struggling with my coursework, and they provided the expert help I needed to pass my exams with ease. The quality of work is exceptional, and the customer service is top-notch. Highly recommend to anyone needing academic assistance!",
      stars: 4,
      date: "2025-03-18",
      profile: "https://randomuser.me/api/portraits/men/6.jpg",
    },
  ];

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <div className="py-20 px-4 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-tertiary/30 rounded-full text-primary text-sm font-medium shadow-sm">
            <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
            <span>Client Testimonials</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-tight">
              What Our Clients Say
            </h2>

            {/* Decorative underline */}
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Rating value={4.8} readOnly size="md" />
              </div>
              <div className="text-dark">
                <span className="text-2xl font-bold text-primary">{4.8}</span>
                <span className="text-sm text-dark/70 ml-1">out of 5</span>
              </div>
            </div>

            <div className="h-6 w-px bg-tertiary/50 hidden sm:block"></div>

            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-primary">{2}k+</div>
              <div className="text-sm text-dark/70">Happy Students</div>
            </div>

            <div className="h-6 w-px bg-tertiary/50 hidden sm:block"></div>

            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-secondary">99%</div>
              <div className="text-sm text-dark/70">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Clean Reviews Layout */}
        <div className="space-y-12">
          {/* Top Row - Two Large Featured Reviews */}
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.slice(0, 2).map((review, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-tertiary/20 hover:border-secondary/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={review.profile}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-secondary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-primary">
                          {review.name}
                        </h3>
                        <p className="text-dark/60 text-sm">Verified Student</p>
                      </div>
                      <Rating value={review.stars} readOnly size="md" />
                    </div>

                    <blockquote className="text-dark text-base leading-relaxed">
                      "{review.comment}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-2 border-t border-tertiary/20">
                      <span className="text-sm text-dark/60">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-xs font-medium text-secondary">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Row - Three Medium Reviews */}
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(2, 5).map((review, index) => (
              <div
                key={index + 2}
                className="group bg-light border-2 border-primary/10 hover:border-primary/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={review.profile}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover mx-auto border-3 border-primary/20"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-primary text-lg">
                      {review.name}
                    </h4>
                    <Rating
                      value={review.stars}
                      readOnly
                      size="sm"
                      className="justify-center mt-2"
                    />
                  </div>

                  <blockquote className="text-dark/80 text-sm leading-relaxed line-clamp-4">
                    "{review.comment.substring(0, 120)}..."
                  </blockquote>

                  <div className="pt-3 border-t border-tertiary/20">
                    <span className="text-xs text-dark/60">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - One Wide Review */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary to-dark text-light rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex-shrink-0">
                  <img
                    src={reviews[5].profile}
                    alt={reviews[5].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-secondary"
                  />
                </div>

                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-light">
                        {reviews[5].name}
                      </h3>
                      <p className="text-tertiary">Success Story</p>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end space-x-2 mt-2 lg:mt-0">
                      <Rating value={reviews[5].stars} readOnly size="lg" />
                      <span className="text-secondary text-xl font-bold">
                        {reviews[5].stars}/5
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-lg text-light/90 leading-relaxed italic">
                    "{reviews[5].comment}"
                  </blockquote>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-tertiary text-sm">
                      {new Date(reviews[5].date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                    <div className="px-4 py-2 bg-secondary/20 rounded-full">
                      <span className="text-secondary text-sm font-semibold">
                        ⭐ Top Review
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm border border-tertiary/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-dark/70 mb-6 leading-relaxed">
              Join thousands of students who have achieved their academic dreams
              with our expert guidance and support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={"/signup"}>
                <button className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-500 hover:to-secondary text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">Get Started Today</span>
                </button>
              </Link>
              <Link to={'/other-services'} >
                <button className="group relative overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-tertiary/30 hover:border-secondary/50 text-primary hover:text-secondary font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/70">
                  <span className="relative z-10">Our Services</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
