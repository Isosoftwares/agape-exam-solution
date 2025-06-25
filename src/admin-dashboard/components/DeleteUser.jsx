import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DeleteUser({ user, handleCloseModal, invalidate }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const deleteRecord = (data) => {
    return axios.delete(
      `/user/delete/permanent/${auth?.userId}/${user?._id}`,
      data
    );
  };
  

  const {
    mutate: deleteMutate,
    isLoading: loadingDelete,
    error,
  } = useMutation({
    mutationFn: deleteRecord,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`${invalidate}`]);
      handleCloseModal();
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  return (
    <div>
      <p className="mt-3 text-gray-700">
        Are you sure you want to Delete this user.{" "}
      </p>
      <p className="text-sm text-red-500">This action is irreversiable</p>
      <div className="flex flex-row-reverse justify-center items-center gap-3 py-3">
        <button
          disabled={loadingDelete}
          type="Submit"
          className="px-6 py-2 disabled:cursor-not-allowed bg-red-500 disabled:bg-gray-300 outline-none focus:border-primary  text-light rounded-md cursor-pointer  hover:bg-opacity-95 "
          onClick={() => {
            deleteMutate();
          }}
        >
          Yes, Delete
        </button>
        <button
          className="px-3 py-2 bg-gray-800 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
          onClick={(e) => {
            e.preventDefault();
            handleCloseModal();
          }}
        >
          No, Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteUser;