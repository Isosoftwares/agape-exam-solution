import { Modal, Radio, RingProgress } from "@mantine/core";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formatDateandTime from "../../utils/formatDateandTime";
import useAuth from "../../hooks/useAuth";
import { useDisclosure } from "@mantine/hooks";
import Subscriptions from "../../website/components/Subscriptions";
import { toast } from "react-toastify";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";

function ReviewTest() {
  const { state } = useLocation();

  const score = (state?.correctAnswerScore / state?.questions?.length) * 100;

  function getColorBasedOnScore(score) {
    if (score === 0) {
      return "red";
    } else if (score < 70) {
      return "red";
    } else {
      return "green";
    }
  }
  function getMessageBasedOnScore(score) {
    if (score === 0) {
      return "You are not yet ready for the exam. Keep practising";
    } else if (score < 70) {
      return "You are not yet ready for the exam. Keep practising";
    } else {
      return "Great! You are ready for the test!";
    }
  }

  const { auth } = useAuth();

  const navigate = useNavigate();

  const [openedSubs, { open: openSubs, close: closeSubs }] = useDisclosure(
    false
  );

  function hasSubscription(subscriptions, serviceName) {
    for (const subscription of subscriptions) {
      if (subscription.subscriptionId.serviceName === serviceName) {
        return true;
      }
    }
    return false;
  }

  //handle naavigation
  const handleNavigation = () => {
    const { subscriptionType, examType, _id } = state?.testPaperId;
    const examUrl = `/${examType}/take-test/${_id}`;
    const subscriptionUrl = `/${examType}-practice-test-papers#subscriptions`;

    if (subscriptionType === "Free") {
      navigate(examUrl);
    } else if (subscriptionType === "Premium") {
      if (hasSubscription(auth?.subscription, examType)) {
        navigate(examUrl);
      } else {
        openSubs();
      }
    } else {
      toast.info(
        "An error occurred. Please refresh your browser or contact us if the issue persists!"
      );
    }
  };

  const QuestionItem = ({ question, index }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    const handleToggleExplanation = () => {
      setShowExplanation(!showExplanation);
    };

    return (
      <div className="mb-4 p-4 border rounded shadow">
        <h3 className="font-bold text-lg mb-2">
          {index + 1}. {question.question}
        </h3>
        {question.questionImg && (
          <img
            src={question.questionImg}
            alt={`Question ${index + 1}`}
            className="mb-2"
          />
        )}
        <div>
          {["A", "B", "C", "D"].map((option) => (
            <div
              key={option}
              className={`p-2 my-1 rounded ${
                question.clientAnswer === option
                  ? question.clientAnswer === question.correctAnswer
                    ? "bg-green-200 bg-opacity-70  text-dark"
                    : "bg-red-500  bg-opacity-70  text-dark"
                  : question.correctAnswer === option
                  ? "bg-green-500  bg-opacity-70  text-dark"
                  : ""
              } flex items-center gap-3 `}
            >
              <p>{`${option}: ${question?.[option?.toLowerCase()]}`}</p>{" "}
              {question.correctAnswer === option && (
                <IoMdCheckmark color="green" size={30} />
              )}
            </div>
          ))}
        </div>
        {showExplanation && (
          <div
            dangerouslySetInnerHTML={{
              __html: question?.explanation,
            }}
          ></div>
        )}
        <button
          onClick={handleToggleExplanation}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <Modal opened={openedSubs} onClose={closeSubs} title="" size={"auto"}>
        <div>
          <p className="font-bold text-xl text-primary text-center capitalize ">
            {" "}
            Select a subscription an access all premiums practice test papers
          </p>
        </div>
        <Subscriptions
          close={true}
          handleClose={closeSubs}
          serviceName={state?.testPaperId?.examType}
        />
      </Modal>
      <div className="bg-light">
        <div className="py-4 px-3">
          <h1 className="text-primary text-xl font-bold leading-tight mb-3 capitalize">
            {state?.testPaperId?.examType} Practice test results review
          </h1>
        </div>
      </div>

      {/* the review */}
      <div>
        <p className="font-bold text-lg py-2 ">{state?.testPaperId?.name}</p>
        <div className="bg-light py-4 flex flex-col md:flex-row gap-10 ">
          <div className="flex flex-col justify-center items-center">
            {!score ? (
              <RingProgress
                size={150}
                label={
                  <p className="text-center font-bold">
                    Score {score?.toFixed(2)}%
                  </p>
                }
                sections={[
                  {
                    value: 100,
                    color: getColorBasedOnScore(score),
                  },
                ]}
              />
            ) : (
              <RingProgress
                size={150}
                label={
                  <p className="text-center font-bold">
                    Score {score?.toFixed(2)}%
                  </p>
                }
                sections={[
                  {
                    value: score,
                    color: getColorBasedOnScore(score),
                  },
                ]}
              />
            )}
          </div>
          <div className="w-full">
            <div className="flex justify-between  pr-3">
              <div>
                <p className="font-bold text- ">
                  {state?.questions?.length} Questions
                </p>
                <p className="font-bold text- ">
                  {state?.correctAnswerScore} Correct answer(s)
                </p>
                <p className="font-bold text- ">
                  Done On: {formatDateandTime(state?.createdAt)}
                </p>
              </div>
              <div>
                <span
                  onClick={handleNavigation}
                  className="bg-primary text-light py-2 px-3 rounded-md "
                >
                  Retake Test
                </span>
              </div>
            </div>
            {/* message */}
            <div className="bg-[#56d6ec] px-5 py-5 text-center w-full mt-5">
              <p className="text-xl font-bold">
                {getMessageBasedOnScore(score)}
              </p>
            </div>
          </div>
        </div>

        {/* questions */}
        <p className="font-bold text-lg mt-4">Questions and answers</p>
        <div className="bg-light py-4  mt-2 ">
          <div className="container mx-auto p-4">
            {state?.questions?.map((question, index) => (
              <QuestionItem
                key={question._id}
                question={question}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewTest;
