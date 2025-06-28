import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import loginimg from "./assets/graphics/reg.jpg";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Helmet } from "react-helmet-async";
import axios from "./api/axios";
import { Loader } from "@mantine/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useAuth from "./hooks/useAuth";
import { isValidPhoneNumber } from "libphonenumber-js";

function SignUpWithReferral() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { setAuth, persist, setPersist } = useAuth();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Access the passed state
  const dashboardPath = location.state?.dashboardPath;
  const toClient = "/select-service";

  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralValid, setReferralValid] = useState(null);
  const [marketerName, setMarketerName] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const navigate = useNavigate();

  // Load referral code from localStorage on component mount
  useEffect(() => {
    const savedReferralCode = localStorage.getItem('referralCode');
    const savedMarketerName = localStorage.getItem('referralMarketerName');
    
    if (savedReferralCode && savedMarketerName) {
      setReferralCode(savedReferralCode);
      setMarketerName(savedMarketerName);
      setReferralValid(true);
      setValue('referralCode', savedReferralCode);
    }
  }, [setValue]);

  // Get referral code from URL params if present (this takes priority over localStorage)
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      const upperRefCode = refCode.toUpperCase();
      setReferralCode(upperRefCode);
      setValue('referralCode', upperRefCode);
      // Clear localStorage when new ref code comes from URL
      localStorage.removeItem('referralCode');
      localStorage.removeItem('referralMarketerName');
    }
  }, [searchParams, setValue]);

  // Validate referral code
  const { data: referralData, isLoading: validatingReferral } = useQuery({
    queryKey: ['validateReferral', referralCode],
    queryFn: async () => {
      if (!referralCode || referralCode.length < 3) return null;
      const response = await axios.get(`/marketers/validate/${referralCode}`);
      return response.data;
    },
    enabled: !!referralCode && referralCode.length >= 3,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle referral validation results and localStorage sync
  useEffect(() => {
    if (referralData?.success) {
      setReferralValid(true);
      setMarketerName(referralData.data.marketerName);
      
      // Save valid referral code and marketer name to localStorage
      localStorage.setItem('referralCode', referralCode);
      localStorage.setItem('referralMarketerName', referralData.data.marketerName);
    } else if (referralData?.success === false) {
      setReferralValid(false);
      setMarketerName("");
      
      // Clear localStorage for invalid referral codes
      localStorage.removeItem('referralCode');
      localStorage.removeItem('referralMarketerName');
    } else {
      setReferralValid(null);
      setMarketerName("");
    }
  }, [referralData, referralCode]);

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
      const referredBy = response?.data?.referredBy;

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
      
      // Clear referral code from localStorage after successful signup
      localStorage.removeItem('referralCode');
      localStorage.removeItem('referralMarketerName');
      
      let text = `Welcome ${userName || ""}`;
      if (referredBy) {
        text += ` (Referred by ${referredBy})`;
      }
      toast.success(text);

      navigate(toClient, { replace: true, state: { from: "signup" } });
    },
    onError: (err) => {
      const text = err.response?.data?.message || "Something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
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
    data.site = "Agape Exam"
    if (referralCode && referralValid) {
      data.referralCode = referralCode;
    }
    
    loginMutate(data);
  };

  const handleReferralCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setReferralCode(value);
    setValue('referralCode', value);
    
    // Clear localStorage when manually changing referral code
    if (!value) {
      localStorage.removeItem('referralCode');
      localStorage.removeItem('referralMarketerName');
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Helmet>
        <title>Create Account | Agape Smart Solutions</title>
      </Helmet>

      <NavBar />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20 pt-[90px]">
        <div className="w-full max-w-7xl bg-white rounded-md shadow-md overflow-hidden border-t-4 border-t-secondary">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-2 lg:p-5">
              <div className="mx-auto">
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

                  {/* Referral Info */}
                  {referralCode && referralValid && marketerName && (
                    <div className="bg-green-50 border hidden border-green-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-green-700">
                        🎉 You're signing up through <strong>{marketerName}</strong>'s referral!
                      </p>
                    </div>
                  )}
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

                  {/* Referral Code Field */}
                  <div className="hidden">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Referral Code (Optional)
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors duration-300 ${
                          referralCode ? 
                            (referralValid ? "border-green-500 focus:border-green-500" : 
                             referralValid === false ? "border-red-500 focus:border-red-500" :
                             "border-tertiary/30 focus:border-primary") :
                            "border-tertiary/30 focus:border-primary"
                        }`}
                        type="text"
                        placeholder="Enter referral code"
                        value={referralCode}
                        onChange={handleReferralCodeChange}
                        {...register("referralCode")}
                      />
                      {validatingReferral && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader size="sm" />
                        </div>
                      )}
                    </div>
                    {referralCode && referralValid === false && (
                      <p className="text-red-500 text-sm mt-1">
                        Invalid referral code
                      </p>
                    )}
                    {referralCode && referralValid === true && marketerName && (
                      <p className="text-green-600 text-sm mt-1">
                        Valid referral from {marketerName}
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
                  {referralCode && referralValid && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-6">
                      <p className="text-white text-sm">
                        🎁 Special referral bonus waiting for you!
                      </p>
                    </div>
                  )}
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

export default SignUpWithReferral;