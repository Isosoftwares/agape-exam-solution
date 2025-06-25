import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { Loader } from "@mantine/core";
import subjects from "../../utils/subjects";
import Editor from "../../components/Editor";
import "react-quill/dist/quill.snow.css";

function AddPaper() {
  const axios = useAxiosPrivate();
  const [explanations, setExplanations] = useState({});
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const examTypeWatch = watch("examType");

  const subjectss = (exam) => {
    if (exam === "TEAS") {
      return subjects()?.TEAS;
    } else if (exam === "GED") {
      return subjects()?.GED;
    } else if (exam === "HESI") {
      return subjects()?.HESI;
    } else {
      return [];
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // Initialize with 15 questions
  React.useEffect(() => {
    if (fields.length === 0) {
      for (let i = 0; i < 2; i++) {
        append({
          question: "",
          explanation: "",
          A: "",
          B: "",
          C: "",
          D: "",
          correctAnswer: "",
          questionImage: "",
        });
      }
    }
  }, []);

  const addPaperFnc = (data) => {
    return axios.post("/test-paper", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const {
    mutate: testPaperMutate,
    isPending: loadingAddPaper,
    error,
  } = useMutation({
    mutationFn: addPaperFnc,
    onSuccess: (response) => {
      reset();
      setExplanations({});
      const text = response.data.message;

      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";

      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    const formData = new FormData();

    // Append other form data
    formData.append("name", data.name);
    formData.append("subject", data?.subject);
    formData.append("examType", data.examType);
    formData.append("subscriptionType", data.subscriptionType);
    formData.append("tag", data.tag);

    // Append thumbnail
    if (data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    // Append questions with explanations
    const questionsWithExplanations = data.questions.map((question, index) => ({
      ...question,
      explanation: explanations[index] || "",
    }));
    formData.append("questions", JSON.stringify(questionsWithExplanations));

    let questionImagesIndex = [];

    // Append question images and build the questionImagesIndex array
    data.questions?.forEach((question, index) => {
      if (question?.questionImage && question.questionImage[0]) {
        formData.append(`questionImg`, question.questionImage[0]);
        questionImagesIndex.push(index);
      } else {
        formData.append(`questionImg`, ""); // Append empty string if no image
      }
    });

    formData.append(`questionImagesIndex`, JSON.stringify(questionImagesIndex));

    testPaperMutate(formData);
  };

  return (
    <div className="bg-light min-h-[400px] pb-3">
      <form action="" onSubmit={handleSubmit(onSubmitting)}>
        <h3 className="text-lg text-center font-semibold capitalize bg-primary bg-opacity-10 py-3">
          Add Practice Test Paper
        </h3>

        <div className="px-2 pt-3">
          {/* details section */}
          <div>
            <p className="">1. Practice test paper details</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 border px-2 bg-gray-50 ">
              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Test Paper Name{" "}
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  className={` ${
                    errors?.name && "border-red-500"
                  } mt-1 px-2 py-1  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                  placeholder="Enter test paper name"
                  {...register("name", {
                    required: true,
                  })}
                />
                <p className="text-xs text-red-500 mt-1">
                  {errors?.name && "Test paper name is required!"}
                </p>
              </div>

              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Exam Type{" "}
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <select
                  name=""
                  id=""
                  className={` ${
                    errors?.examType && "border-red-500"
                  } mt-1 px-2 py-3  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                  {...register("examType", {
                    required: true,
                  })}
                >
                  <option value="">Select exam type...</option>
                  <option value="GED">GED</option>
                  <option value="TEAS">TEAS</option>
                  <option value="HESI">HESI</option>
                </select>
                <p className="text-xs text-red-500 mt-1">
                  {errors?.examType && "Exam type is required!"}
                </p>
              </div>

              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Subject{" "}
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <select
                  className={` ${
                    errors?.subject && "border-red-500"
                  } mt-1 px-2 py-3  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                  {...register("subject", {
                    required: true,
                  })}
                >
                  <option value="">Select subject...</option>
                  {subjectss(examTypeWatch)?.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-red-500 mt-1">
                  {errors?.subjevt && "Subject is required!"}
                </p>
              </div>

              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Subscription Type
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <select
                  name=""
                  id=""
                  className={` ${
                    errors?.subscriptionType && "border-red-500"
                  } mt-1 px-2 py-3  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                  {...register("subscriptionType", {
                    required: true,
                  })}
                >
                  <option value="">Select subscription type...</option>
                  <option value="Premium">Premium</option>
                  {/* <option value="Free">Free</option> */}
                </select>
                <p className="text-xs text-red-500 mt-1">
                  {errors?.subscriptionType && "Subscription type is required!"}
                </p>
              </div>
              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Tag{" "}
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <select
                  name=""
                  id=""
                  className={` ${
                    errors?.tag && "border-red-500"
                  } mt-1 px-2 py-3  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                  {...register("tag", {
                    required: true,
                  })}
                >
                  <option value="">Select tag...</option>
                  <option value="Priority Premium Test">Priority Premium Test</option>
                  <option value="Bonus Practice Test">Bonus Practice Test</option>
                </select>
                <p className="text-xs text-red-500 mt-1">
                  {errors?.tag && "Tag is required!"}
                </p>
              </div>

              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Test Paper Image(Thumbnail)
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className={`rounded-md   file:mr-4 file:py-[11px] file:px-4
                   file:border-0 shadow
                  file:text-md file:font-semibold
                 file:text-violet-700
                  bg-primary text-light `}
                  {...register("thumbnail", {
                    required: true,
                  })}
                />
                <p className="text-xs text-red-500 mt-1">
                  {errors?.thumbnail && "Test paper thumbnail is required!"}
                </p>
              </div>
            </div>
          </div>

          {/* questions */}
          <div>
            <p className="mt-4">2. Questions</p>
            {fields?.map((item, index) => (
              <div
                key={item.id}
                className="my-10  border-2 border-cyan-50 p-2 rounded "
              >
                <div className="mb-2 ">
                  <div className="border-b-2 flex justify-between items-center  mb-3">
                    <label className="block text  font-bold  ">
                      Question {index + 1}
                    </label>
                    <div
                      className="mt-4 flex items-center text-red-500 justify-start cursor-pointer  gap-2 "
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <FaMinus size={18} />
                      <p className="  font-bold ">Remove this Question</p>
                    </div>
                  </div>
                  <textarea
                    className={`mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                    placeholder={`Enter question ${index + 1}`}
                    {...register(`questions.${index}.question`, {
                      required: true,
                    })}
                  ></textarea>
                  {errors?.questions?.[index]?.question && (
                    <p className="text-xs text-red-500 mt-1">
                      Question is required!
                    </p>
                  )}
                </div>
                <p className="font-bold text-gray-700 ">
                  Question {index + 1} Answers
                </p>
                <div className="grid lg:grid-cols-2 gap-2">
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option} className="mb-2">
                      <label className="block text-md font-medium text-gray-700">
                        Option {option}
                      </label>
                      <textarea
                        className={` mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                        placeholder={`Enter option ${option}`}
                        {...register(`questions.${index}.${option}`, {
                          required: true,
                        })}
                      ></textarea>

                      {errors?.questions?.[index]?.[`${option}`] && (
                        <p className="text-xs text-red-500 mt-1">
                          Option {option} is required!
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-2">
                  <label className="block text-md font-medium text-gray-700">
                    Correct Answer
                  </label>
                  <select
                    className={`mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                    {...register(`questions.${index}.correctAnswer`, {
                      required: true,
                    })}
                  >
                    <option value="">Select correct answer...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  {errors?.questions?.[index]?.correctAnswer && (
                    <p className="text-xs text-red-500 mt-1">
                      Correct answer is required!
                    </p>
                  )}
                </div>
                <div className="mb-2 ">
                  <div className="border-b-2 flex justify-between items-center  mb-3">
                    <label className="block text    ">
                      Explanation (optional)
                    </label>
                  </div>

                  {/* set the value of the editor to be entered value and also update the question onchange */}

                  <Editor
                    value={explanations[index] || ""}
                    onChange={(value) => {
                      const newExplanations = {
                        ...explanations,
                        [index]: value,
                      };
                      setExplanations(newExplanations);
                    }}
                  />

                  {/* <textarea
                    className={`mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                    placeholder={`Enter expalanation`}
                    {...register(`questions.${index}.explanation`, {
                      required: false,
                    })}
                  ></textarea> */}
                </div>

                <div className="mb-2">
                  <label className="block text-md font-medium text-gray-700">
                    Question Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`rounded-md file:mr-4 file:py-[8px] file:px-4 file:border-0 shadow file:text-md file:font-semibold file:text-violet-700 bg-primary text-light`}
                    {...register(`questions.${index}.questionImage`)}
                  />
                </div>
              </div>
            ))}

            <div
              className="mt-4 flex items-center text-primary justify-start cursor-pointer "
              onClick={() =>
                append({
                  question: "",
                  A: "",
                  B: "",
                  C: "",
                  D: "",
                  correctAnswer: "",
                  questionImage: "",
                  explanation: "",
                })
              }
            >
              <MdAdd size={25} />
              <p className="  font-bold ">Add Question</p>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-8 flex justify-center">
            <button
              disabled={loadingAddPaper}
              className="bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center gap-2 items-center text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
            >
              <span> Add Practice Test</span>{" "}
              {loadingAddPaper && <Loader size={19} color="blue" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPaper;
