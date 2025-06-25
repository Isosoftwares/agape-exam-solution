import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Loader, Modal, Pagination, Radio, RingProgress } from "@mantine/core";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { MdVerified } from "react-icons/md";

function TakeTest() {
  const { auth } = useAuth();
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState({ correct: 0, incorrect: 0 });
  const [correctness, setCorrectness] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const getPapers = () => {
    return axios.get(`/test-paper/one/${_id}`);
  };

  const {
    isLoading: loadingPaper,
    data: paperData,
    refetch: refetchPapper,
    isRefetching: refetchingpaper,
    isError: errorGetingPaper,
    error,
  } = useQuery({
    queryKey: [`papers--${_id}`],
    queryFn: getPapers,
  });

  const handleComplete = () => {
    const unanswered = paperData?.data?.questions?.some(
      (item, index) => !answers[index]
    );

    if (unanswered) {
      toast.error("Please answer all questions before completing the test.");
      return;
    }

    let correct = 0;
    let incorrect = 0;
    const newCorrectness = {};

    paperData?.data?.questions?.forEach((item, index) => {
      if (answers[index] === item.correctAnswer) {
        correct++;
        newCorrectness[index] = "correct";
      } else {
        incorrect++;
        newCorrectness[index] = "incorrect";
      }
    });

    setResult({ correct, incorrect });
    setCorrectness(newCorrectness);
    setCompleted(true);
  };

  const handleRetake = () => {
    window.location.reload();
  };

  const saveResults = (results) => {
    return axios.post(`/test-paper/submit`, results);
  };

  const {
    mutate: saveResultsMutate,
    isPending: loadingSavePaper,
  } = useMutation({
    mutationFn: saveResults,
    onSuccess: (response) => {
      const text = response.data.message;
      toast.success(text);
      setIsSaved(true);
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";
      toast.error(text);
    },
  });

  const handleSaveResults = () => {
    const questions = paperData?.data?.questions?.map((item, index) => ({
      question: item.question,
      questionImg: item.questionImg || "",
      a: item.A,
      b: item.B,
      c: item.C,
      d: item.D,
      correctAnswer: item.correctAnswer,
      clientAnswer: answers[index] || "",
      explanation: item?.explanation || "",
    }));

    const results = {
      correctAnswerScore: result.correct,
      testPaperId: _id,
      clientId: auth?.userId,
      questions: questions,
      examType: paperData?.data?.examType,
    };
    saveResultsMutate(results);
  };

  const handleAnswerSelect = (value, index) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
    setShowExplanation((prev) => ({
      ...prev,
      [index]: false,
    }));
    setCorrectness((prev) => ({
      ...prev,
      [index]:
        value === paperData?.data?.questions[index].correctAnswer
          ? "correct"
          : "incorrect",
    }));
  };

  const currentQuestionData = paperData?.data?.questions[currentQuestion];
  const score = (result.correct / paperData?.data?.questions.length) * 100;

  function getColorBasedOnScore(score) {
    if (score === 0) {
      return "red";
    } else if (score < 70) {
      return "red";
    } else {
      return "green";
    }
  }
  const mysavedtestlink = `/${paperData?.data?.examType?.toLowerCase()}/my-tests`;
  return (
    <div className="bg-gray-100">
      <Modal opened={opened} onClose={close} title="Redo this paper" centered>
        <div>
          <p className="text-brown-800">
            This page will reload and reset all the questions and answers will
            not be saved.
          </p>
          <div className="flex py-4 justify-center gap-3">
            <button
              className="bg-red-400 text-light px-3 py-1 rounded-md "
              onClick={() => {
                handleRetake();
              }}
            >
              Yes, Retake paper{" "}
            </button>
            <button
              className="bg-gray-700 text-light px-3 py-1 rounded-md "
              onClick={() => {
                close();
              }}
            >
              No, Cancel{" "}
            </button>
          </div>
        </div>
      </Modal>

      <div className="">
        {loadingPaper ? (
          <div className="flex justify-center items-center h-[300px] ">
            Please wait.. <Loader color="blue" size={20} />
          </div>
        ) : (
          <div>
            <p className="font-bold py-2 text-center">
              {paperData?.data?.examType}: {paperData?.data?.name}
            </p>

            <div className=" ">
              <div className={` bg-light py-3 px-2`}>
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b-2 pb-2">
                  <div className="flex flex-row flex-wrap gap-2 divide-x-3 ">
                    <div className="flex justify-start items-center gap-2 mx-3">
                      <span className="text-gray-600"> Exam:</span>
                      <p>{paperData?.data?.examType}</p>
                    </div>
                    <div className="flex justify-start items-center gap-2 mx-3">
                      <span className="text-gray-600"> Subject:</span>
                      <p>{paperData?.data?.subject}</p>
                    </div>
                    <div className="flex justify-start items-center gap-2 mx-3">
                      <span className="text-gray-600"> Questions:</span>
                      <p>{paperData?.data?.noOfQuestions} </p>
                    </div>
                  </div>
                  <div>
                    <Pagination
                      total={paperData?.data?.questions?.length}
                      page={currentQuestion}
                      color="blue"
                      onChange={(value) => {
                        setCurrentQuestion(value - 1);
                      }}
                    />
                  </div>
                </div>

                <div className={`${completed && "hidden"}`}>
                  {currentQuestionData && (
                    <div
                      key={currentQuestion}
                      className="my-10 border-2 border-cyan-50 p-2 rounded"
                    >
                      <div className="mb-2">
                        <label className="block text font-bold">
                          Question {currentQuestion + 1}
                        </label>
                        <p className="text-lg font-bold">
                          {currentQuestionData?.question}
                        </p>
                      </div>
                      <div>
                        {currentQuestionData?.questionImg && (
                          <img src={currentQuestionData?.questionImg} alt="" />
                        )}
                      </div>

                      <div>
                        <Radio.Group
                          value={answers[currentQuestion]}
                          onChange={(value) =>
                            handleAnswerSelect(value, currentQuestion)
                          }
                        >
                          {["A", "B", "C", "D"].map((option) => (
                            <div
                              key={option}
                              className={`flex gap-3 items-center my-2 p-2 rounded ${
                                correctness[currentQuestion] &&
                                currentQuestionData.correctAnswer === option
                                  ? "bg-green-200"
                                  : answers[currentQuestion] === option &&
                                    correctness[currentQuestion] === "incorrect"
                                  ? "bg-[#ee8d8d]"
                                  : answers[currentQuestion] === option &&
                                    correctness[currentQuestion] === "correct"
                                  ? "bg-green-200"
                                  : ""
                              }`}
                            >
                              <Radio
                                disabled={answers[currentQuestion]}
                                value={option}
                              />
                              <p>{currentQuestionData[option]}</p>
                            </div>
                          ))}
                        </Radio.Group>
                      </div>

                      {showExplanation[currentQuestion] && (
                        <div className="my-2">
                          <div className="mt-2 bg-gray-100 px-3 py-1">
                            <div className="border-b-2 flex justify-between items-center mb-3">
                              <label className="block font-bold ">
                                Explanation
                              </label>
                            </div>
                            <div>
                              <p className="font-bold">
                                Correct answer:{" "}
                                {
                                  currentQuestionData[
                                    currentQuestionData.correctAnswer
                                  ]
                                }
                              </p>
                            </div>
                            <div>
                              <p>Explanation:</p>
                              <div
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: currentQuestionData?.explanation || "",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        disabled={!answers[currentQuestion]}
                        onClick={() =>
                          setShowExplanation((prev) => ({
                            ...prev,
                            [currentQuestion]: !prev[currentQuestion],
                          }))
                        }
                        className={` disabled:cursor-not-allowed  px-3 py-1 bg-blue-400 disabled:bg-gray-400  text-light rounded-md mt-2`}
                      >
                        {showExplanation[currentQuestion]
                          ? "Hide Explanation"
                          : "Show Explanation"}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center gap-10 mt-4">
                    <button
                      disabled={currentQuestion === 0}
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      className="px-3 py-1 disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-400 text-light rounded-md"
                    >
                      Previous
                    </button>

                    {currentQuestion < paperData?.data?.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="px-3 py-1 bg-blue-400 text-light rounded-md"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="px-3 py-1 bg-green-500 text-light rounded-md"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {completed &&
                (isSaved ? (
                  <div className="bg-light mt-5 py-10 flex flex-col items-center ">
                    <div className="flex gap-2 items-center ">
                      <MdVerified size={22} color="green" />
                      <p className="text-green-600 text-lg ">
                        Your practice test saved successfully!
                      </p>
                    </div>
                    <Link
                      to={mysavedtestlink}
                      className="text-blue-500 underline underline-offset-4 text-md "
                    >
                      View saved practice tests
                    </Link>
                    <button
                      className="bg-primary mt-4 px-2 py-1 text-light rounded-md "
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      {" "}
                      Go Back
                    </button>
                  </div>
                ) : (
                  <div className="bg-light py-4 flex flex-col md:flex-row gap-10 mt-4 ">
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
                      <div className=" pr-3">
                        <div>
                          <p className="font-bold text- ">
                            No of Questions: {paperData?.data?.questions.length}
                          </p>
                          <p className="font-bold text- ">
                            Correct answer(s): {result?.correct}
                          </p>
                          <p className="font-bold text- ">
                            Incorrect answer(s): {result?.incorrect}
                          </p>
                          <p className="font-bold text- ">
                            Score: {score.toFixed(2)}%
                          </p>
                        </div>
                        {loadingSavePaper ? (
                          <div className="flex items-center  gap-1 mt-5">
                            <p className="text-green-700 text-lg">Saving...</p>
                            <Loader color="green" size={20} />
                          </div>
                        ) : (
                          <div className="flex gap-4 mt-5">
                            <button
                              className="bg-red-500 px-2 py-1 text-light rounded-md "
                              onClick={open}
                            >
                              Retake test
                            </button>
                            <button
                              className="bg-primary px-2 py-1 text-light rounded-md "
                              onClick={() => {
                                handleSaveResults();
                              }}
                            >
                              Save Results
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeTest;
