import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { Loader } from "@mantine/core";
import subjects from "../../utils/subjects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function EditPaperInfo({ testPaper, handleClose }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const examTypeWatch = watch("examType") || testPaper?.examType;

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

  const editFn = (data) => {
    return axios.patch("/test-paper/update/details", data, {
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
      handleClose();
      queryClient.invalidateQueries([`all-papers--${testPaper?._id}`]);
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
    formData.append("testPaperId", testPaper?._id);

    // Append thumbnail
    if (data.thumbnail[0]) {
      formData.append("file", data.thumbnail[0]);
    }
    editMutate(formData);
  };
  return (
    <div>
      {" "}
      <form action="" onSubmit={handleSubmit(onSubmitting)}>
        <div>
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 px-2">
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
                  defaultValue={testPaper?.name}
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
                  defaultValue={testPaper?.examType}
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
                defaultValue={testPaper?.subject}
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
                  defaultValue={testPaper?.subscriptionType}
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
                  defaultValue={testPaper?.tag}
                  id=""
                  className={` ${
                    errors?.subscriptionType && "border-red-500"
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
                    required: false,
                  })}
                />
                <p className="text-xs text-red-500 mt-1">
                  {errors?.thumbnail && "Test paper thumbnail is required!"}
                </p>
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
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPaperInfo;
