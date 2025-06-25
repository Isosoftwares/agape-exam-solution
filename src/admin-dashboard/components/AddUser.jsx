import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import usePrimaryColor from "../../hooks/usePrimaryColor";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

function AddUser({ handleAddUserForm }) {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const primaryColor = usePrimaryColor();
  const [phoneNo, setPhoneNo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // signup function
  const registerUser = (registerData) => {
    return axios.post("/user", registerData);
  };

  const {
    mutate: registerMutate,
    isLoading: registerLoading,
    error,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      reset();
      queryClient.invalidateQueries([`users-managers`]);
      queryClient.invalidateQueries([`users-writers-`]);
      const text = response?.data?.message;
      toast.success(text);
      handleAddUserForm();
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";

      toast.error(text);
    },
  });

  const onSubmitting = (data) => {
    data.roles = [data.role];
    registerMutate(data);
  };

  return (
    <div className="bg-light pb-[200px]">
      <div className="bg-light py-3">
        <div className=" min-h-[300px] ">
          <form className="" onSubmit={handleSubmit(onSubmitting)}>
            <div className="mb-4 w-full">
              <div className="flex gap-2 items-center ">
                <label className="block text-md font-medium text-gray-700">
                  User Type / Role
                  <span>
                    <sup className="text-red-500 text-md">*</sup>
                  </span>
                </label>
              </div>
              <select
                name=""
                id=""
                className={` ${
                  errors?.role && "border-red-500"
                } mt-1 px-2 py-3  border border-gray-400 outline-none focus:border-primary rounded w-full`}
                {...register("role", {
                  required: true,
                })}
              >
                <option value="">Select role...</option>
                <option value="Writer">Writer</option>
                <option value="Manager">Manager</option>
              </select>
              <p className="text-xs text-red-500 mt-1">
                {errors?.role && "User type is required!"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="mb-4 w-full">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-[3px] border border-gray-500 rounded-md focus:outline-none focus:border-blue-500 text-dark "
                  {...register("userName", {
                    required: true,
                  })}
                />
                <p className="text-xs text-red-500">
                  {errors?.userName?.type === "required" && "Name is required"}
                </p>
              </div>
            </div>
            <div className="mb-4 w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-2 py-[3px] border text-dark border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
                {...register("email", {
                  required: true,
                })}
              />
              <p className="text-xs text-red-500">
                {errors?.email?.type === "required" && "Email is required"}
              </p>
            </div>
            <div className="mb-1 w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                phone number
              </label>
              <div className="w-full">
                <input
                  type="number"
                  className="w-full px-2 py-[3px] border text-dark border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
                  {...register("phoneNo", {
                    required: true,
                  })}
                />
              </div>

              <p className="text-xs text-red-500">
                {errors?.phoneNo?.type === "required" &&
                  "Phone number is required"}
              </p>
            </div>
            <div className="mb-1 w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Create password
              </label>
              <div className="w-full">
                <input
                  type="number"
                  className="w-full px-2 py-[3px] border text-dark border-gray-500 rounded-md focus:outline-none focus:border-blue-500"
                  {...register("password", {
                    required: true,
                  })}
                />
              </div>

              <p className="text-xs text-red-500">
                {errors?.password?.type === "required" &&
                  "Password is required"}
              </p>
            </div>

            <div className="flex justify-center items-center mt-5">
              <button
                disabled={registerLoading}
                type="submit"
                className={`${primaryColor} disabled:bg-gray-600 shadow-md shadow-cyan-100 mb-4 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-600`}
              >
                {registerLoading ? "Adding..." : " Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
