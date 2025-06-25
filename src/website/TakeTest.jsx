import React, { useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loader, Modal, Radio } from "@mantine/core";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import CTA from "./components/CTA";
import whatsappNumber from "../utils/whatsappNumber";

function TakeTest() {
  const { auth } = useAuth();
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState({ correct: 0, incorrect: 0 });
  const [correctness, setCorrectness] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const defaultMessage = encodeURIComponent(
    "Hello Agape, I would need to inquire about your exams services."
  );
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
    // Validation to check if all questions are answered
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

  // Save results
  const saveResults = (results) => {
    return axios.post(`/test-paper/submit`, results);
  };

  const {
    mutate: saveResultsMutate,
    isPending: loadingSavePaper,
  } = useMutation({
    mutationFn: saveResults,
    onSuccess: (response) => {
      setAnswers({});
      setCompleted(false);
      setResult({ correct: 0, incorrect: 0 });
      const text = response.data.message;
      toast.success(text);
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
      explanation: item?.expalanation || "",
    }));

    const results = {
      correctAnswerScore: result.correct,
      testPaperId: _id,
      clientId: auth?.userId,
      questions: questions,
    };
    console.log(results);
    saveResultsMutate(results);
  };

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
      <NavBar />

      <div className="pt-[115px] min-h-[80vh] py-4">
        {loadingPaper ? (
          <div className="flex justify-center items-center h-[300px] ">
            Please wait.. <Loader color="blue" size={20} />
          </div>
        ) : (
          <div>
            <div className="px-4 md:px-[100px] mt-4 min-h-[70vh] ">
              <div className="bg-light py-3 px-2">
                <div className="flex flex-row flex-wrap gap-2 divide-x-3 border-b-2 pb-2">
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
                  {paperData?.data?.questions?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="my-10 border-2 border-cyan-50 p-2 rounded"
                      >
                        <div className="mb-2">
                          <label className="block text font-bold">
                            Question {index + 1}
                          </label>
                          <p className="text-lg font-bold">{item?.question}</p>
                        </div>

                        <div>
                          <Radio.Group
                            value={answers[index]}
                            onChange={(value) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [index]: value,
                              }))
                            }
                          >
                            {["A", "B", "C", "D"].map((option) => (
                              <div
                                key={option}
                                className={`flex gap-3 items-center my-2 p-2 rounded ${
                                  completed
                                    ? item.correctAnswer === option
                                      ? "bg-green-200 "
                                      : answers[index] === option
                                      ? "bg-[#ee8d8d]"
                                      : ""
                                    : ""
                                }`}
                              >
                                <Radio
                                  value={option}
                                  color={`${
                                    completed
                                      ? item.correctAnswer === option
                                        ? "green"
                                        : answers[index] === option
                                        ? "red"
                                        : ""
                                      : ""
                                  }`}
                                />
                                <p>{item[option]}</p>
                              </div>
                            ))}
                          </Radio.Group>
                        </div>

                        <div
                          className={` ${
                            !completed && "hidden"
                          }  mb-2 bg-gray-100 px-3 py-1`}
                        >
                          <div className="border-b-2 flex justify-between items-center mb-3">
                            <label className="block font-bold ">
                              Explanation
                            </label>
                          </div>
                          <div>
                            <p>Correct answer: {item[item.correctAnswer]}</p>
                          </div>
                          <div>
                            <p>Explanation: {item?.explanation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!completed ? (
                  <div className="flex justify-center">
                    <button
                      onClick={handleComplete}
                      className="px-3 py-1 bg-primary text-light rounded-md"
                    >
                      Complete
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-100 px-4 rounded-md py-3 ">
                    <p className="text-2xl font-bold text-primary my-3">
                      Your Results:
                    </p>
                    <div className="flex gap-3 items-center">
                      <p className="text-xl font-bold py-2">
                        Correct Answers:{" "}
                      </p>
                      <p className="text-xl font-bold py-2">{result.correct}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <p className="text-xl font-bold py-2">
                        Incorrect Answers:{" "}
                      </p>
                      <p className="text-xl font-bold py-2">
                        {result.incorrect}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <p className="text-xl font-bold py-2">Score: </p>
                      <p className="text-xl font-bold py-2">
                        {(
                          (result.correct / paperData?.data?.noOfQuestions) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </p>
                    </div>

                    {loadingSavePaper ? (
                      <div className="flex items-center ">
                        <span className="text-primary">Saving...</span>{" "}
                        <Loader size={19} color="blue" />
                      </div>
                    ) : (
                      <div className="flex gap-3 items-center my-4">
                        <button
                          onClick={open}
                          className="px-3 py-1 bg-gray-600 text-light rounded-md"
                        >
                          Retake The Paper
                        </button>
                        <span
                          onClick={handleSaveResults}
                          className="px-3 py-1 bg-primary text-light rounded-md"
                        >
                          Save Results
                        </span>
                      </div>
                    )}
                    <p className="font-bold border-y-2 border-y-gray-300">
                      Note:{" "}
                      <span className="text-green-500">
                        Once you save your test result, you can always view them
                        in your client dashboard.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeTest;
