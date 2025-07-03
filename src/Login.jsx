import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Divider, Loader, Modal, PasswordInput } from "@mantine/core";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import appName from "./utils/AppName";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import loginimg from "./assets/graphics/login.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  // Access the passed state
  const dashboardPath = location.state?.dashboardPath;

  const toDash = location.state?.from?.pathname || "/dashboard/overview";
  const toClient = dashboardPath || "/select-service";
  const [visiblePassword, setVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const login = (loginData) => {
    return axios.post("/auth/login", loginData);
  };

  const {
    mutate: loginMutate,
    isPending: loginLoading,
    error,
  } = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      reset();
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userId = response?.data?.user_Id;
      const userName = response?.data?.email?.split("@")[0];
      const imgUrl = response.data.imgUrl;
      const isEmailVerified = response.data.isEmailVerified;
      const permissions = response.data.permissions;
      const balance = response.data.balance;
      const subscription = response.data.subscription;

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
      localStorage.setItem("activeDashboard", dashboardPath || "/client");
      const text = `Welcome back ${userName || ""}`;

      if (roles?.includes("Client")) {
        toast.success(text);
        navigate(toClient, { replace: true });
      }
      if (roles?.includes("Admin")) {
        toast.success(text);
        navigate(toDash, { replace: true });
      }
      if (roles?.includes("Writer")) {
        setAuth({});
        return toast.error("User not found!");
      }
      if (roles?.includes("Manager")) {
        toast.success(text);
        navigate(toDash, { replace: true });
      }
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";

      setErrMsg(text);
      setTimeout(() => {
        setErrMsg("");
      }, 10000);

      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    data.site = "Agape Exam";
    loginMutate(data);
  };

  return (
    <div className="min-h-screen bg-light">
      <Helmet>
        <title>Login | {appName()}</title>
      </Helmet>
      <NavBar />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20 pt-[90px]">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-t-primary ">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/90 z-10"></div>
              <img
                loading="lazy"
                src={loginimg}
                alt="Student login"
                className="w-full h-full "
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-light">
                    Welcome Back to
                    <span className="block text-secondary">
                      Agape Smart Solutions
                    </span>
                  </h2>
                  <p className="text-xl text-tertiary leading-relaxed">
                    Continue your journey to academic excellence with our expert
                    guidance and support.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-2">
              <div className="px-2 lg:px-5 mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 border-b">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <span>Login Now</span>
                  </div>

                  <h1 className="text-3xl font-black text-primary">
                    Agape Smart{" "}
                    <span className="text-3xl font-black text-secondary">
                      Solutions
                    </span>
                  </h1>
                  <p className="text-dark/70">
                    Welcome back! Please sign in to your account.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmitting)}
                  className="space-y-3 border p-2 rounded-md  "
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
                        placeholder="Enter your password"
                        className="flex-1 px-4 py-3 bg-transparent outline-none"
                        disabled={loginLoading}
                        {...register("password", { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setVisiblePassword(!visiblePassword)}
                        className="px-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                        disabled={loginLoading}
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link
                      to="/reset/password"
                      className="text-sm text-primary hover:text-secondary transition-colors duration-300 font-medium"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-4 bg-primary hover:bg-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    {loginLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader size="sm" />
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-tertiary/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-dark/60">
                        Don't have an account?
                      </span>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <Link
                    to="/sign-up"
                    state={{ dashboardPath: dashboardPath }}
                    className="w-full py-4 border-2 border-primary/20 hover:border-primary/50 text-primary hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 flex items-center justify-center"
                  >
                    Create New Account
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
