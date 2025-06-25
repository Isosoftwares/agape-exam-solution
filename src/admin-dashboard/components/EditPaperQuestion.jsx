import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Loader } from "@mantine/core";
import Editor from "../../components/Editor";
import "react-quill/dist/quill.snow.css";

function EditPaperQuestion({ testPaperId, handleClose, question }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [explanation, setExplanation] = useState(question?.explanation);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const editFn = (data) => {
    return axios.patch("/test-paper/update/question", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const { mutate: editMutate, isPending: loadingEdit, error } = useMutation({
    mutationFn: editFn,
    onSuccess: (response) => {
      reset();
      const text = response.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`all-papers--${testPaperId}`]);
      handleClose();
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    const formData = new FormData();
    const updatedQuestion = {
      question: data?.question,
      A: data?.A,
      B: data?.B,
      C: data?.C,
      D: data?.D,
      correctAnswer: data?.correctAnswer,
      explanation: explanation,
    };

    // Append other form data
    formData.append("testPaperId", testPaperId);
    formData.append("questionId", question?._id);
    formData.append("newQuestion", JSON.stringify(updatedQuestion));

    // Append thumbnail
    if (data.questionImage[0]) {
      formData.append("file", data.questionImage[0]);
    }

    editMutate(formData);
  };
  return (
    <div>
      <div>
        <form action="" onSubmit={handleSubmit(onSubmitting)}>
          <div className="p-2  ">
            <div className=" ">
              <div className="border-b-2 flex justify-between items-center  mb-3">
                <label className="block text  font-bold  ">Question</label>
              </div>
              <textarea
                defaultValue={question?.question}
                className={`mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                placeholder={`Enter question`}
                {...register(`question`, {
                  required: true,
                })}
              ></textarea>
              {errors?.question && (
                <p className="text-xs text-red-500 mt-1">
                  Question is required!
                </p>
              )}
            </div>
            <p className="font-bold text-gray-700 "> Answers</p>
            <div className="grid grid-cols-1 gap-2">
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="">
                  <label className="block text-md font-medium text-gray-700">
                    Option {option}
                  </label>
                  <textarea
                    defaultValue={question?.[option]}
                    className={` mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                    placeholder={`Enter option ${option}`}
                    {...register(`${option}`, {
                      required: true,
                    })}
                  ></textarea>

                  {errors?.[`${option}`] && (
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
                defaultValue={question?.correctAnswer}
                className={`mt-1 px-2 py-1 border border-gray-400 outline-none focus:border-primary rounded w-full`}
                {...register(`correctAnswer`, {
                  required: true,
                })}
              >
                <option value="">Select correct answer...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              {errors?.correctAnswer && (
                <p className="text-xs text-red-500 mt-1">
                  Correct answer is required!
                </p>
              )}
            </div>
            <div className="mb-2 ">
              <div className="border-b-2 flex justify-between items-center  mb-3">
                <label className="block text    ">Explanation (optional)</label>
              </div>
              <Editor
                value={explanation}
                onChange={(value) => {
                  setExplanation(value);
                }}
              />
            </div>

            <div className="mb-2">
              <label className="block text-md font-medium text-gray-700">
                Question Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className={`rounded-md file:mr-4 file:py-[8px] file:px-4 file:border-0 shadow file:text-md file:font-semibold file:text-violet-700 bg-primary text-light`}
                {...register(`questionImage`)}
              />
            </div>
          </div>

          {/* buttons */}
          <div className="mt-8 flex justify-center">
            <button
              disabled={loadingEdit}
              className="bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center gap-2 items-center text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
            >
              <span> Update</span>{" "}
              {loadingEdit && <Loader size={19} color="blue" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPaperQuestion;
