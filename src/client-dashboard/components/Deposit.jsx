import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Loader } from "@mantine/core";

function Deposit({ handleClose, clientId }) {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // depo function
  const deposit = (registerData) => {
    return axios.post(`/payments/deposit`, registerData);
  };

  const {
    mutate: depositMutate,
    isPending: depositLoading,
    error,
  } = useMutation({
    mutationFn: deposit,
    onSuccess: (response) => {
      const url = response?.data?.url;
      const text = response.data.message;
      toast.success(text);
      window.location = url;
    },
    onError: (err) => {
      const text = err?.response.data.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (data) => {
    data.userId = auth?.userId;
    depositMutate(data);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmitting)} className=" ">
        <div className="flex flex-col gap-2 py-2">
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
        <div className="flex justify-center mt-6">
          {depositLoading ? (
            <Loader color="yellow" />
          ) : (
            <input
              type="Submit"
              value={"Add Funds"}
              className="bg-primary text-light rounded-md cursor-pointer hover:bg-dark hover:text-light ease-in-out duration-300 t font-semibold   px-6 py-1  "
            />
          )}
        </div>
      </form>
    </div>
  );
}

export default Deposit;
