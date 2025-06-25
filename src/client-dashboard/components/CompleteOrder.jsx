import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader, Modal } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import { DateInput } from "@mantine/dates";

function CompleteOrder({ order, closeModal }) {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // edit function
  const completeAssignment = (data) => {
    return axios.patch("/assignments/complete-order", data);
  };

  const {
    mutate: completeAssignmentMutate,
    isPending: loadingCompleteAssignment,
    error,
  } = useMutation({
    mutationFn: completeAssignment,
    onSuccess: (response) => {
      reset();
      queryClient.invalidateQueries([`assignments-details-${order?._id}`]);
      queryClient.invalidateQueries([`assignments-orders`]);
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
    data.orderId = order?._id;
    completeAssignmentMutate(data);
  };

  return (
    <div className="bg-light py-3">
      <div className="">
        <div className=" min-h- ">
          <form
            className="  "
            onSubmit={handleSubmit(onSubmitting)}
          >
            <div>
              <p>Mark Assignment as Complete</p>
              <p className="font-bold my-3">OrderNo :#{order?.orderNo}</p>
            </div>

            <div className="flex justify-center items-center">
              <button
                disabled={
                  order?.status == "Completed" || loadingCompleteAssignment
                }
                type="submit"
                className={`bg-primary disabled:bg-gray-600 shadow-md shadow-cyan-100 mb-4 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-600`}
              >
                {loadingCompleteAssignment
                  ? "Loading..."
                  : " Complete Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteOrder;
