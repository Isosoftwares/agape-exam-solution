import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DeductWriterEarning({ writer, closeModal }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // signup function
  const deductWriter = (data) => {
    return axios.post("/writer-payments/deduct/writer", data);
  };

  const { mutate: deductMutate, isPending: loadingPay } = useMutation({
    mutationFn: deductWriter,
    onSuccess: (response) => {
      reset();
      queryClient.invalidateQueries([`writers-`]);
      queryClient.invalidateQueries([`user-${writer?._id}`]);
      const text = response?.data?.message;
      toast.success(text);
      closeModal();
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";

      toast.error(text);
    },
  });

  const onSubmitting = (data) => {
    data.writerId = writer?._id;

    deductMutate(data);
  };
  return (
    <div>
      <p>
        Deduct writer: <span className="font-bold  ">{writer?.userName}</span>
      </p>

      <form className="" onSubmit={handleSubmit(onSubmitting)}>
        <div className="my-4 w-full">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Amount
          </label>
          <input
            type="number"
            min={1}
            className="w-full px-2 py-[3px] border text-dark border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            {...register("amount", {
              required: true,
            })}
          />
          <p className="text-xs text-red-500">
            {errors?.amount?.type === "required" && "Amount is required"}
          </p>
        </div>
        <div className="mb-4 w-full">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Description / Reason
          </label>
          <input
            type="text"
            className="w-full px-2 py-[3px] border text-dark border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
            {...register("mpesaCode", {
              required: true,
            })}
          />
          <p className="text-xs text-red-500">
            {errors?.mpesaCode?.type === "required" &&
              "Description is required"}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <button
            disabled={loadingPay}
            type="submit"
            className={` bg-primary disabled:bg-gray-600 shadow-md shadow-cyan-100 mb-4 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-600`}
          >
            {loadingPay ? "Processing..." : " Deduct writer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeductWriterEarning;
