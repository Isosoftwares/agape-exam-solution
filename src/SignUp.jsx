import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import loginimg from "./assets/graphics/reg.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Helmet } from "react-helmet-async";
import axios from "./api/axios";
import { Loader } from "@mantine/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useAuth from "./hooks/useAuth";
import { isValidPhoneNumber } from "libphonenumber-js";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { setAuth, persist, setPersist } = useAuth();

  const location = useLocation();

  // Access the passed state
  const dashboardPath = location.state?.dashboardPath;

  const toClient = "/select-service";

  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const navigate = useNavigate();

  const signUp = (loginData) => {
    return axios.post("/client", loginData);
  };

  const { mutate: loginMutate, isPending: loadingSignup, error } = useMutation({
    mutationFn: signUp,

    onSuccess: (response) => {
      reset();
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userId = response?.data?.user_Id;
      const userName = response?.data?.email?.split("@")[0];
      const imgUrl = response?.data?.imgUrl || "";
      const isEmailVerified = response?.data?.isEmailVerified || "";
      const permissions = response?.data.permissions || "";
      const balance = response.data?.balance || 0;
      const subscription = response?.data.subscription || "";

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
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem("activeDashboard", "/client");
      const text = `Welcome ${userName || ""}`;
      toast.success(text);

      navigate(toClient, { replace: true, state: { from: "signup" } });
    },
    onError: (err) => {
      const text = err.response.data.messsage || "Something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
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
    loginMutate(data);
  };

  return (
    <div className="min-h-screen bg-light">
      <Helmet>
        <title>Create Account | Agape Smart Solutions</title>
      </Helmet>

      <NavBar />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20 pt-[90px]  ">
        <div className="w-full max-w-7xl bg-white rounded-md shadow-md overflow-hidden border-t-4 border-t-secondary">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-2 lg:p-5">
              <div className=" mx-auto ">
                {/* Header */}
                <div className="text-center space-y-2 border-b mb-2">
                  <div className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full text-secondary text-sm font-medium mb-4">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <span>Join Us Today</span>
                  </div>

                  <h1 className="text-2xl font-black text-primary">
                    Create Account
                  </h1>
                  <p className="text-dark/70">
                    Start your journey to academic success with us.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmitting)}
                  className="space-y-3 border px-2 py-3 rounded-md"
                >
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email Address
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors duration-300 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-tertiary/30 focus:border-primary"
                      }`}
                      type="email"
                      placeholder="Enter your email address"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        Email is required
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
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
                        border: phoneNoError
                          ? "1px solid #ef4444"
                          : "1px solid rgba(205, 199, 238, 0.3)",
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                    {phoneNoError && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
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
                        placeholder="Create a strong password"
                        className="flex-1 px-4 py-3 bg-transparent outline-none"
                        disabled={loadingSignup}
                        {...register("password", { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setVisiblePassword(!visiblePassword)}
                        className="px-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                        disabled={loadingSignup}
                      >
                        {visiblePassword ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        Password is required
                      </p>
                    )}
                  </div>

                  {/* Terms and Privacy */}
                  <div className="text-sm text-dark/60 text-center">
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-secondary transition-colors duration-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-secondary transition-colors duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingSignup}
                    className="w-full py-4 bg-secondary hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    {loadingSignup ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size="sm" />
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-tertiary/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-dark/60">
                        Already have an account?
                      </span>
                    </div>
                  </div>

                  {/* Sign In Link */}
                  <Link
                    to="/login"
                    state={{ dashboardPath: dashboardPath }}
                    className="w-full py-4 border-2 border-primary/20 hover:border-primary/50 text-primary hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 flex items-center justify-center"
                  >
                    Sign In Instead
                  </Link>
                </form>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/90 z-10"></div>
              <img
                src={loginimg}
                alt="Student registration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-light">
                    Join
                    <span className="block text-white">10,000+ Students</span>
                  </h2>
                  <p className="text-xl text-light/90 leading-relaxed">
                    Start your academic success journey today with personalized
                    support and expert guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;
