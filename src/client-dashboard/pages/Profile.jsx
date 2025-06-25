import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Divider, Loader, Modal, Skeleton } from "@mantine/core";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import ChangePassword from "../../components/ChangePassword";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [editDetails, setEditDetails] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // get user
  const getUser = async () => {
    return await axios.get(`/client/one/${auth?.userId}`);
  };

  const {
    isLoading: loadingUser,
    data: userData,
    refetch: refetcUser,
    isRefetching: refetchingUser,
  } = useQuery({
    queryFn: getUser,
    queryKey: [`user-${auth?.userId}`],
    keepPreviousData: true,
  });

  // edit user
  const editFn = (data) => {
    return axios.patch("/client", data);
  };

  const { mutate: editMutate, isPending: loadingEdit, error } = useMutation({
    mutationFn: editFn,
    onSuccess: (response) => {
      reset();
      const text = response.data.message;
      toast.success(text);
      setEditDetails(false);
      queryClient.invalidateQueries([`user-${auth?.userId}`]);
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    data.clientId = auth?.userId;
    editMutate(data);
  };
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div className=" flex flex-col md:flex-row gap-4  ">
      <Modal opened={opened} onClose={close} title="Change password" centered>
        <ChangePassword handleCloseModal={close} userType={"client"} />
      </Modal>
      <Skeleton visible={loadingUser}>
        {loadingUser ? (
          <div></div>
        ) : (
          <div className="bg-white overflow-hidden shadow rounded-lg border w-full">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-bold text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Join date:{" "}
                  <span className="text-gray-500 mt-1 max-w-2xl text-sm">
                    {userData?.data?.client?.createdAt?.split("T")[0]}
                  </span>
                </p>
              </div>
              <div>
                <button
                  className={` ${
                    editDetails && "hidden"
                  } bg-tertiary text-gray-900 px-4 py-1 rounded-md  `}
                  onClick={() => {
                    setEditDetails(true);
                  }}
                >
                  Edit Details
                </button>
              </div>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmitting)}>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 flex sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium w-full text-gray-500">
                      User name
                    </dt>
                    {editDetails ? (
                      <div className="w-full">
                        <input
                          defaultValue={userData?.data?.client?.userName}
                          className={`border-[#496cce]  bg-gray-200 text-gray-700  focus:outline-none focus:shadow-outline border  rounded py-2 px-4 block w-full appearance-none`}
                          type="text"
                          placeholder="Enter username"
                          {...register("userName", {
                            required: false,
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.userName?.type === "required" &&
                            "Email is required"}
                        </p>
                      </div>
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900 w-full sm:mt-0 sm:col-span-2">
                        {userData?.data?.client?.userName || "N/A"}
                      </dd>
                    )}
                  </div>
                  <div className="py-3 sm:py-5 flex  sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium w-full text-gray-500">
                      Email address
                    </dt>
                    {editDetails ? (
                      <div className="w-full">
                        <input
                          defaultValue={userData?.data?.client?.email}
                          className={`border-[#496cce]  bg-gray-200 text-gray-700  focus:outline-none focus:shadow-outline border  rounded py-2 px-4 block w-full appearance-none`}
                          type="email"
                          placeholder="Enter email"
                          {...register("email", {
                            required: true,
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.email?.type === "required" &&
                            "Email is required"}
                        </p>
                      </div>
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900 w-full sm:mt-0 sm:col-span-2">
                        {userData?.data?.client?.email}
                      </dd>
                    )}
                  </div>
                  <div className="py-3 sm:py-5 flex sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium w-full text-gray-500">
                      Phone number
                    </dt>
                    {editDetails ? (
                      <div className="w-full">
                        <input
                          defaultValue={userData?.data?.client?.phoneNo}
                          className={`border-[#496cce]  bg-gray-200 text-gray-700  focus:outline-none focus:shadow-outline border  rounded py-2 px-4 block w-full appearance-none`}
                          type="number"
                          placeholder="Enter number"
                          {...register("phoneNo", {
                            required: true,
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.phoneNo?.type === "required" &&
                            "Phone no is required"}
                        </p>
                      </div>
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900 w-full sm:mt-0 sm:col-span-2">
                        {userData?.data?.client?.phoneNo || "N/A"}
                      </dd>
                    )}
                  </div>
                </dl>
                {/* buttons */}
                {loadingEdit ? (
                  <p className="text-center my-4 text-green-600 ">
                    Saving Please wait...{" "}
                  </p>
                ) : (
                  <div
                    className={` ${
                      !editDetails && "hidden"
                    } flex justify-center items-center gap-2 my-5  `}
                  >
                    <button className="bg-primary text-light px-4 py-1 rounded-md  ">
                      Save Changes
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditDetails(!editDetails);
                      }}
                      className="bg-gray-600 text-light px-4 py-1 rounded-md  "
                    >
                      Cancel Editing
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </Skeleton>

      {/* edit password */}
      <div className=" w-full ">
        <div className="bg-white overflow-hidden shadow min-h-[230px] rounded-lg border p-2 ">
          <p>Actions</p>
          <Divider />
          <div className="flex justify-start items-center gap-2 my-5 ">
            <button
              className="bg-green-400 text-light px-4 py-1 rounded-md  "
              onClick={open}
            >
              Change Password
            </button>
            <button
              onClick={() => {
                signOut();
              }}
              className="bg-red-400 text-light px-4 py-1 rounded-md  "
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
