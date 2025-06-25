import React, { useState } from "react";
import { Group, Loader, MultiSelect, Stepper, Tabs, rem } from "@mantine/core";
import whatsappNumber from "../../utils/whatsappNumber";
import { Button } from "react-scroll";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "../../api/axios";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { isValidPhoneNumber } from "libphonenumber-js";
import { PhoneInput } from "react-international-phone";
import { toast } from "react-toastify";

function TakeMyTEAS() {
  const { auth, setAuth } = useAuth();
  const [grade, setGrade] = useState("");
  const [examDate, setExamDate] = useState("");
  const [action, setAction] = useState(auth?.userId ? "loggedin" : "signup");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [testType, setTestType] = useState("TEAS");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const isFormComplete = grade && examDate;

  const handleSendMessage = () => {
    const phoneNumber = whatsappNumber();
    const message = `Hello, I need help with my TEAS exam:\n
      - Grade: ${grade}\n
      - Scheduled Exam Date: ${examDate}\n
      -Budget $${calculateTotalCost(grade)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const calculateTotalCost = (grade) => {
    if (grade === "90-100") {
      return 650;
    } else if (grade === "80-89") {
      return 600;
    } else if (grade === "70-79") {
      return 550;
    } else return 0;
  };

  const [active, setActive] = useState(0);
  const nextStep = () => {
    setActive(1);
  };
  const prevStep = () => {
    setActive(0);
  };

  // mutation
  const sendFn = (loginData) => {
    return axios.post("/test", loginData);
  };

  const { mutate: testMutate, isPending: loadingTest, error } = useMutation({
    mutationFn: sendFn,

    onSuccess: (response) => {
      if (action === "loggedin") {
        const url = response?.data?.stripeSessionUrl?.url;
        const text = "Payment link generated";
        toast.success(text);
        window.open(url, "_blank");
      } else {
        const accessToken = response?.data?.userData?.accessToken;
        const roles = response?.data?.userData?.roles;
        const userId = response?.data?.userData?.user_Id;
        const userName = response?.data?.userData?.email?.split("@")[0];
        const imgUrl = response.data?.userData?.imgUrl;
        const isEmailVerified = response.data?.userData?.isEmailVerified;
        const permissions = response.data?.userData?.permissions;
        const balance = response.data?.userData?.balance;
        const subscription = response.data?.userData?.subscription;
        const url = response?.data?.stripeSessionUrl?.url;

        setAuth({
          roles,
          accessToken,
          userId,
          imgUrl,
          userName,
          isEmailVerified,
          permissions,
          balance,
          subscription,
        });

        reset();
        localStorage.setItem("userId", JSON.stringify(userId));
        localStorage.setItem("activeDashboard", "/teas");
        const text = `Payment link generated!`;
        toast.success(text);
        window.open(url, "_blank");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);
    },
  });

  // submits
  const signinSubmit = async (data) => {
    data.grade = grade;
    data.date = examDate;
    data.amount = calculateTotalCost(grade);
    data.testType = testType;
    data.action = "signin";

    testMutate(data);
  };

  const signUpSubmit = async (data) => {
    const internationalPhoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if (!phoneNo) {
      setPhoneNoError(true);
      setErrorMessage("Phone number is required.");
      return;
    }

    if (!isValidPhoneNumber(phoneNo, "International")) {
      setPhoneNoError(true);
      setErrorMessage("Please enter a valid phone number.");
      return;
    }
    data.phoneNo = phoneNo;
    data.grade = grade;
    data.date = examDate;
    data.amount = calculateTotalCost(grade);
    data.testType = testType;
    data.action = "signup";
    testMutate(data);
  };

  const logedIn = async () => {
    const data = {};
    data.grade = grade;
    data.date = examDate;
    data.amount = calculateTotalCost(grade);
    data.testType = testType;
    data.clientId = auth?.userId;
    data.action = "loggedin";
    testMutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-primary">
          Need Help With Your TEAS Exam?
        </h2>
        <p className="text-dark/70">Describe your TEAS exam requirements</p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl p-2 border border-tertiary/20 shadow-lg overflow-hidden">
        {auth?.userId ? (
          /* Logged In User Form */
          <div className="p-8 space-y-6">
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Target Grade
                </label>
                <select
                  className="w-full px-4 py-3 border border-tertiary/30 rounded-xl focus:border-primary focus:outline-none"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="">Select Target Grade</option>
                  <option value="70-79">70-79</option>
                  <option value="80-89">80-89</option>
                  <option value="90-100">90 and Above</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Scheduled Exam Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-tertiary/30 rounded-xl focus:border-primary focus:outline-none"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
            </div>

            {/* Price Display */}
            {isFormComplete && (
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Total Price
                </label>
                <div className="w-full px-4 py-3 bg-secondary/10 border border-secondary/30 rounded-xl">
                  <span className="text-2xl font-bold text-secondary">
                    ${calculateTotalCost(grade)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-4">
              {loadingTest ? (
                <div className="inline-flex items-center space-x-2 text-primary">
                  <Loader size="sm" />
                  <span>Processing...</span>
                </div>
              ) : (
                <button
                  disabled={!isFormComplete || loadingTest}
                  className="px-3 py-3 bg-primary hover:bg-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-300"
                  onClick={logedIn}
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Non-logged In User Stepper */
          <div className="">
            <Stepper
              active={active}
              allowNextStepsSelect={false}
              styles={{
                step: {
                  padding: "12px",
                },
                stepBody: {
                  marginTop: "24px",
                },
              }}
            >
              <Stepper.Step
                label="Exam Details"
                description="Tell us about your TEAS exam"
              >
                <div className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Target Grade
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-tertiary/30 rounded-xl focus:border-primary focus:outline-none"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      >
                        <option value="">Select Target Grade</option>
                        <option value="70-79">70-79</option>
                        <option value="80-89">80-89</option>
                        <option value="90-100">90 and Above</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Scheduled Exam Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-tertiary/30 rounded-xl focus:border-primary focus:outline-none"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Price Display */}
                  {isFormComplete && (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Total Price
                      </label>
                      <div className="w-full px-4 py-3 bg-secondary/10 border border-secondary/30 rounded-xl">
                        <span className="text-2xl font-bold text-secondary">
                          ${calculateTotalCost(grade)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      disabled={!isFormComplete}
                      className="px-8 py-3 bg-primary hover:bg-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-300"
                      onClick={nextStep}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </Stepper.Step>

              <Stepper.Step label="Account" description="Sign up or sign in">
                <div className="space-y-6">
                  {/* Auth Toggle */}
                  <div className="flex bg-tertiary/10 rounded-xl p-1">
                    <button
                      onClick={() => setAction("signup")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                        action === "signup"
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-white/50"
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setAction("signin")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                        action === "signin"
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-white/50"
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Auth Forms */}
                  {action === "signin" ? (
                    <form
                      onSubmit={handleSubmit(signinSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Email
                        </label>
                        <input
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors duration-300 ${
                            errors.email
                              ? "border-red-500"
                              : "border-tertiary/30 focus:border-primary"
                          }`}
                          type="email"
                          placeholder="Enter your email"
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            Email is required
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Password
                        </label>
                        <div
                          className={`flex items-center border rounded-xl transition-colors duration-300 ${
                            errors.password
                              ? "border-red-500"
                              : "border-tertiary/30 focus-within:border-primary"
                          }`}
                        >
                          <input
                            type={visiblePassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="flex-1 px-4 py-3 bg-transparent outline-none"
                            {...register("password", { required: true })}
                          />
                          <button
                            type="button"
                            onClick={() => setVisiblePassword(!visiblePassword)}
                            className="px-3 text-gray-500 hover:text-gray-700"
                          >
                            {visiblePassword ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            Password is required
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3 border border-tertiary/30 text-dark font-semibold rounded-xl hover:bg-tertiary/10 transition-colors duration-300"
                        >
                          Back
                        </button>
                        <button
                          disabled={loadingTest}
                          className="flex-1 py-3 bg-primary hover:bg-dark disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors duration-300"
                        >
                          {loadingTest ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader size="sm" />
                              Submitting...
                            </span>
                          ) : (
                            "Submit Request"
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleSubmit(signUpSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Email
                        </label>
                        <input
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors duration-300 ${
                            errors.email
                              ? "border-red-500"
                              : "border-tertiary/30 focus:border-primary"
                          }`}
                          type="email"
                          placeholder="Enter your email"
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            Email is required
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Phone Number
                        </label>
                        <PhoneInput
                          country="us"
                          value={phoneNo}
                          onChange={(value) => {
                            phoneNoError && setPhoneNoError(false);
                            setPhoneNo(value);
                          }}
                          inputStyle={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid rgba(205, 199, 238, 0.3)",
                            borderRadius: "12px",
                            fontSize: "16px",
                          }}
                        />
                        {phoneNoError && (
                          <p className="text-red-500 text-sm mt-1">
                            {errorMessage}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Password
                        </label>
                        <div
                          className={`flex items-center border rounded-xl transition-colors duration-300 ${
                            errors.password
                              ? "border-red-500"
                              : "border-tertiary/30 focus-within:border-primary"
                          }`}
                        >
                          <input
                            type={visiblePassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="flex-1 px-4 py-3 bg-transparent outline-none"
                            {...register("password", { required: true })}
                          />
                          <button
                            type="button"
                            onClick={() => setVisiblePassword(!visiblePassword)}
                            className="px-3 text-gray-500 hover:text-gray-700"
                          >
                            {visiblePassword ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            Password is required
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3 border border-tertiary/30 text-dark font-semibold rounded-xl hover:bg-tertiary/10 transition-colors duration-300"
                        >
                          Back
                        </button>
                        <button
                          disabled={loadingTest}
                          className="flex-1 py-3 bg-primary hover:bg-dark disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors duration-300"
                        >
                          {loadingTest ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader size="sm" />
                              Creating Account...
                            </span>
                          ) : (
                            "Create Account & Submit"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Stepper.Step>
            </Stepper>
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeMyTEAS;
