import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

function AddOrderReport({ closeModal, testId, report }) {
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const addReportFn = (data) => {
    return axios.patch(`/test/add-report`, data);
  };

  const {
    mutate: reportMutate,
    isPending: loadingAddReport,
    error,
  } = useMutation({
    mutationFn: addReportFn,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`my-exam-orders-`]);
      closeModal();
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    data.testId = testId;
    reportMutate(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col w-full">
          <label
            htmlFor=""
            className="block text-sm font-semibold text-gray-600 mb-1"
          >
            Report
            <span className="text-red-500">
              <sup>*</sup>
            </span>
          </label>
          <textarea
            defaultValue={report}
            className="w-full border px-2 outline-none focus:outline-none rounded border-primary  "
            name=""
            id=""
            rows={4}
            {...register("report", {
              required: true,
            })}
          ></textarea>

          <p className="text-red-500 text-xs mt-1 ">
            {errors.report?.type === "required" && "Report is required"}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-[50px] ">
          <button
            disabled={loadingAddReport}
            type="submit"
            className={`  bg-primary disabled:bg-gray-600   text-light rounded-md cursor-pointer hover:bg-opacity-100 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Add Report
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            disabled={loadingAddReport}
            className={`  bg-gray-800 disabled:bg-gray-600  text-light rounded-md cursor-pointer hover:bg-opacity-90 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddOrderReport;
