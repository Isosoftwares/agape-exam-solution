import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import F404Page from "./F404Page";
import Login from "./Login";
import Unauthorized from "./Unauthorized";
import Home from "./website/Home";
import ContactUs from "./website/ContactUs";
import OnlineClassHelp from "./website/OnlineClassHelp";
import EssayHelp from "./website/EssayHelp";
import OnlineExamHelp from "./website/OnlineExamHelp";
import GEDPracticeTest from "./website/GEDPracticeTest";
import TEasPracticeTest from "./website/TEasPracticeTest";
import HowItWorks from "./website/HowItWorks";
import Dasbhoard from "./client-dashboard/Dasbhoard";
import OverView from "./client-dashboard/pages/OverView";
import CreateOrder from "./client-dashboard/pages/CreateOrder";
import Profile from "./client-dashboard/pages/Profile";
import MyOrders from "./client-dashboard/pages/MyOrders";
import MyPapers from "./client-dashboard/pages/MyPapers";
import Wallet from "./client-dashboard/pages/Wallet";
import AdminDashboard from "./admin-dashboard/AdminDashboard";
import AddPaper from "./admin-dashboard/pages/AddPaper";
import AdminOverview from "./admin-dashboard/pages/AdminOverview";
import ExamOrders from "./admin-dashboard/pages/ExamOrders";
import ClassOrders from "./admin-dashboard/pages/ClassOrders";
import ClassDetails from "./admin-dashboard/pages/ClassDetails";
import AssignmentDetails from "./admin-dashboard/pages/AssignmentDetails";
import ExamDetails from "./admin-dashboard/pages/ExamDetails";
import AssignmentOrders from "./admin-dashboard/pages/AssignmentOrders";
import AllPapers from "./admin-dashboard/pages/AllPapers";
import ClientAttempts from "./admin-dashboard/pages/ClientAttempts";
import Clients from "./admin-dashboard/pages/Clients";
import Pricing from "./admin-dashboard/pages/Pricing";
import Subscriptions from "./admin-dashboard/pages/Subscriptions";
import AdminProfile from "./admin-dashboard/pages/AdminProfile";
import SignUp from "./SignUp";
import { IoLogoWhatsapp, IoMdClose } from "react-icons/io";
import { useState } from "react";
import whatsappNumber from "./utils/whatsappNumber";
import TEASDashboard from "./TEAS-Dashboard/TEASDashboard";
import TeasOverview from "./TEAS-Dashboard/pages/TeasOverview";
import Exams from "./TEAS-Dashboard/pages/Exams";
import MyTeasTests from "./TEAS-Dashboard/pages/MyTeasTests";
import TakeTest from "./client-dashboard/pages/TakeTest";

import GEDDashboard from "./GED-Dashboard/GEDDashboard";
import GEDOverview from "./GED-Dashboard/pages/GEDOverview";
import GEDExams from "./GED-Dashboard/pages/GEDExams";
import MyGEDTests from "./GED-Dashboard/pages/MyGEDTests";

import HESIDashboard from "./HESI-Dashboard/HESIDashboard";
import HESIOverview from "./HESI-Dashboard/pages/HESIOverview";
import HESIExams from "./HESI-Dashboard/pages/HESIExams";
import MyHESITests from "./HESI-Dashboard/pages/MyHESITests";
import PaperDetails from "./admin-dashboard/pages/PaperDetails";
import ClientDetails from "./admin-dashboard/ClientDetails";
import HESIPracticeTest from "./website/HESIPracticeTest";
import ManagersAndWriters from "./admin-dashboard/pages/ManagersAndWriters";
import Success from "./client-dashboard/pages/Success";
import Failed from "./client-dashboard/pages/Failed ";
import ReviewTest from "./client-dashboard/components/ReviewTest";
import ClientSubscriptions from "./admin-dashboard/components/ClientSubscriptions";
import SubscribedClients from "./admin-dashboard/pages/SubscribedClients";
import Otherservices from "./website/Otherservices";
import useScrollToTop from "./components/useScrollToTop";
import SelectDashBoard from "./client-dashboard/pages/SelectDashBoard";
import TakeMyGED from "./GED-Dashboard/pages/TakeMyGED";
import TakeMyTEAS from "./TEAS-Dashboard/pages/TakeMyTEAS";
import TakeMyHESI from "./HESI-Dashboard/pages/TakeMyHESI";
import w from "./assets/graphics/w1.png";
import ClassdetailsClientClient from "./client-dashboard/pages/ClassdetailsClient";
import WriterDetails from "./admin-dashboard/pages/WriterDetails";
import SubscriptionPaymentSuccess from "./website/SubscriptionPaymentSuccess";
import SubscriptionPaymentFailed from "./website/SubscriptionPaymentFailed";
import ChatWithUs from "./website/ChatWithUs";
import ChatWidget from "./website/chatwidget/ChatWidget";
import Subscribe from "./client-dashboard/pages/Subscribe";
import MyTestExams from "./client-dashboard/pages/MyTestExams";
import DoMyTest from "./website/DoMyTest";
import ClientExams from "./admin-dashboard/pages/ClientExams";
import DoMyTestSuccessPayment from "./website/DoMyTestSuccessPayment";
import FailedDoMyTestPayment from "./website/FailedDoMyTestPayment";
import PasswordResetForm from "./PasswordResetForm";
import ResetPassword from "./ResetPassword";
import MarketerDashboard from "./admin-dashboard/marketers/MarketerDashboard";
import SignUpWithReferral from "./SignUpWithReferral";
import CommissionDashboard from "./admin-dashboard/marketers/CommissionDashboard";
import ReferralAnalytics from "./admin-dashboard/marketers/ReferralAnalytics";

function App() {
  // Create a client
  const queryClient = new QueryClient();
  const location = useLocation();
  const { pathname } = location;
  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would like to inqure about your services! "
  );
  useScrollToTop();
  return (
    // routes
    <div className="relative">
      {/* whatsapp button */}
      {/* <div
        className={` right-10 md:right-2 bottom-10 fixed cursor-pointer  md:w-32 z-50 ${
          (pathname.includes("dashboard") || pathname.includes("login")) &&
          "hidden"
        }`}
      >
        <a
          target="_blank"
          href={`https://wa.me/${whatsappNumber()}?text=${defaultMessage}`}
          className="w-full flex justify-center"
        >
          <img src={w} alt="" className="md:w-20 w-16  " />
        </a>
      </div> */}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <QueryClientProvider client={queryClient}>
        <ChatWithUs />
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpWithReferral />} />
            <Route path="/sign-up" element={<SignUpWithReferral />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/online-class-help" element={<OnlineClassHelp />} />
            <Route path="/other-services" element={<Otherservices />} />
            <Route path="/online-exam-help" element={<OnlineExamHelp />} />
            <Route path="/essay-help" element={<EssayHelp />} />
            <Route path="/my-test" element={<DoMyTest />} />
            <Route
              path="exam-payment/success"
              element={<DoMyTestSuccessPayment />}
            />
            <Route
              path="exam-payment/failed"
              element={<FailedDoMyTestPayment />}
            />
            <Route path="/take-test/:_id" element={<TakeTest />} />
            <Route
              path="/ged-practice-test-papers"
              element={<GEDPracticeTest />}
            />
            <Route
              path="/teas-practice-test-papers"
              element={<TEasPracticeTest />}
            />
            <Route
              path="/hesi-practice-test-papers"
              element={<HESIPracticeTest />}
            />
            <Route path="/select-service" element={<SelectDashBoard />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/*" element={<F404Page />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/payment-successful/:subscriptionId"
              element={<SubscriptionPaymentSuccess />}
            />
            <Route
              path="/payment-failed/:subscriptionId"
              element={<SubscriptionPaymentFailed />}
            />
                <Route path="/reset/password" element={<PasswordResetForm />} />
                <Route path="/password/reset/:userType/:userId/:resetString" element={<ResetPassword />} />

            {/* persist login */}

            {/* client dash */}
            <Route element={<RequireAuth allowedRoles={["Client"]} />}>
              <Route exact path="/client" element={<Dasbhoard />}>
                <Route index element={<OverView />} />
                <Route path="overview" element={<OverView />} />
                <Route path="create-order" element={<CreateOrder />} />
                <Route path="my-orders" element={<MyOrders />} />
                <Route
                  path="my-orders/class/:_id"
                  element={<ClassdetailsClientClient />}
                />
                <Route path="wallet" element={<Wallet />} />
                <Route path="profile" element={<Profile />} />
                <Route path="my-practice-test-papers" element={<MyPapers />} />
                <Route path="success" element={<Success />} />
                <Route path="cancel" element={<Failed />} />
              </Route>
            </Route>

            {/* end client dash */}

            {/* admin dash */}
            <Route
              element={<RequireAuth allowedRoles={["Admin", "Manager"]} />}
            >
              <Route exact path="/dashboard" element={<AdminDashboard />}>
                <Route index element={<AdminOverview />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="orders/classes" element={<ClassOrders />} />
                <Route path="orders/classes/:_id" element={<ClassDetails />} />
                <Route path="orders/exams" element={<ExamOrders />} />
                <Route path="orders/exams/:_id" element={<ExamDetails />} />
                <Route path="client-exams" element={<ClientExams />} />
                <Route
                  path="orders/assignments"
                  element={<AssignmentOrders />}
                />
                <Route
                  path="orders/assignments/:_id"
                  element={<AssignmentDetails />}
                />
                <Route path="add-paper" element={<AddPaper />} />
                <Route path="all-papers" element={<AllPapers />} />
                <Route path="all-papers/:_id" element={<PaperDetails />} />
                <Route path="client-attempts" element={<ClientAttempts />} />
                <Route path="clients" element={<Clients />} />
                <Route
                  path="client-subscription"
                  element={<SubscribedClients />}
                />
                <Route path="users" element={<ManagersAndWriters />} />
                <Route path="users/writer/:_id" element={<WriterDetails />} />
                <Route path="clients/:_id" element={<ClientDetails />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="marketing-dashboard" element={<MarketerDashboard />} />
                <Route path="commission-dashboard" element={<CommissionDashboard />} />
                <Route path="referal-analytics" element={<ReferralAnalytics />} />
              </Route>
            </Route>
            {/* end admin dash */}

            {/* teas dash */}
            <Route element={<RequireAuth allowedRoles={["Client", "Admin"]} />}>
              <Route exact path="/teas" element={<TEASDashboard />}>
                <Route index element={<TeasOverview />} />
                <Route path="overview" element={<TeasOverview />} />
                <Route path="test/:tag" element={<Exams />} />
                <Route path="take-test/:_id" element={<TakeTest />} />
                <Route path="my-tests" element={<MyTeasTests />} />
                <Route path="take-my-test/teas" element={<TakeMyTEAS />} />
                <Route path="review-test/:_id" element={<ReviewTest />} />
                <Route path="profile" element={<Profile />} />
                <Route path="exams/:testType" element={<MyTestExams />} />
              </Route>
            </Route>
            {/* end teas dash */}

            {/* GED dash */}
            <Route element={<RequireAuth allowedRoles={["Client", "Admin"]} />}>
              <Route exact path="/ged" element={<GEDDashboard />}>
                <Route index element={<GEDOverview />} />
                <Route path="overview" element={<GEDOverview />} />
                <Route path="test/:tag" element={<GEDExams />} />
                <Route path="take-test/:_id" element={<TakeTest />} />
                <Route path="my-tests" element={<MyGEDTests />} />
                <Route path="take-my-test/ged" element={<TakeMyGED />} />
                <Route path="review-test/:_id" element={<ReviewTest />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="exams/:testType" element={<MyTestExams />} />
              </Route>
            </Route>
            {/* end GED dash */}

            {/* hesi dash */}
            <Route element={<RequireAuth allowedRoles={["Client", "Admin"]} />}>
              <Route exact path="/hesi" element={<HESIDashboard />}>
                <Route index element={<HESIOverview />} />
                <Route path="overview" element={<HESIOverview />} />
                <Route path="test/:tag" element={<HESIExams />} />
                <Route path="take-test/:_id" element={<TakeTest />} />
                <Route path="my-tests" element={<MyHESITests />} />
                <Route path="take-my-test/hesi" element={<TakeMyHESI />} />
                <Route path="review-test/:_id" element={<ReviewTest />} />
                <Route path="exams/:testType" element={<MyTestExams />} />
              </Route>
            </Route>
            {/* end GED dash */}
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
