import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader } from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DepositByAdmin({ handleClose, clientId }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // depo function
  const deposit = (registerData) => {
    return axios.post(`/payments/register/deposit`, registerData);
  };

  const {
    mutate: depositMutate,
    isLoading: depositLoading,
    error,
  } = useMutation({
    mutationFn: deposit,
    onSuccess: (response) => {
      const text = response.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`user-${clientId}`]);
      handleClose();
    },
    onError: (err) => {
      const text = err?.response.data.message;
      toast.warn(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (data) => {
    data.clientId = clientId;
    depositMutate(data);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmitting)} className="">
        <div className="flex flex-col gap-2 py-2">
          <label htmlFor="" className="text-sm">
            Amount
            <span className="text-red-500">
              <sup>*</sup>
            </span>
          </label>
          <input
            type="number"
            autoFocus
            placeholder="Enter amount to deposit"
            className="outline-none border border-gray-300  p-[5px]  rounded-md  w-full bg-light bg-opacity-90 focus:border-2 focus:border-blue-400 "
            {...register("amount", {
              required: true,
            })}
          />
          <p className="text-red-500 text-xs">
            {errors.amount?.type === "required" && "Amount is required"}
          </p>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <label htmlFor="" className="text-sm">
            Description
            <span className="text-red-500">
              <sup>*</sup>
            </span>
          </label>
          <input
            type="text"
            placeholder="Enter description"
            className="outline-none border border-gray-300  p-[5px]  rounded-md  w-full bg-light bg-opacity-90 focus:border-2 focus:border-blue-400 "
            {...register("description", {
              required: true,
            })}
          />
          <p className="text-red-500 text-xs">
            {errors.description?.type === "required" && "Description is required"}
          </p>
        </div>
        <div>
          {depositLoading ? (
            <div className="flex justify-center gap-3 py-3">
              <Loader color="yellow" />
            </div>
          ) : (
            <div className="flex justify-center gap-3 py-3">
              <input
                type="Submit"
                value={"Deposit"}
                className="bg-primary rounded-md bg-opacity-90 cursor-pointer  hover:text-light ease-in-out duration-300 text-light font-semibold   px-6 py-1  "
              />

              <h1
                className="bg-dark rounded-md text-light bg-opacity-90 cursor-pointer hover:bg-dark hover:text-light ease-in-out duration-300 font-semibold   px-7 py-2  "
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </h1>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default DepositByAdmin;
