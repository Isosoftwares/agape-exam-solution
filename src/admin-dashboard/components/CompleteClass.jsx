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

function CompleteClass({ order, closeModal }) {
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
  const complete = (data) => {
    return axios.patch("/classes/complete-class", data);
  };

  const {
    mutate: completeMutate,
    isPending: loadingcomplete,
    error,
  } = useMutation({
    mutationFn: complete,
    onSuccess: (response) => {
      reset();
      queryClient.invalidateQueries([`class-details-${order?._id}`]);
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
    data.classId = order?._id;
    completeMutate(data);
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
              <p>Mark Class as Completed</p>
              <p className="font-bold my-3">ClassNo :#{order?.classNo}</p>
            </div>

            <div className="flex justify-center items-center">
              <button
                disabled={
                  order?.status == "Completed" || loadingcomplete
                }
                type="submit"
                className={`bg-primary disabled:bg-gray-600 shadow-md shadow-cyan-100 mb-4 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-600`}
              >
                {loadingcomplete
                  ? "Loading..."
                  : " Complete Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteClass;
