import React, { useEffect, useState } from "react";
import { Pagination } from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Clients() {
  const [opened, { open, close }] = useDisclosure(false);
  const [perPage, setPerPage] = useState(20);
  const [activePage, setPage] = useState(1);
  const [name, setName] = useDebouncedState("", 500);
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const getUsers = () => {
    return axios.get(
      `/client?page=${activePage}&perPage=${perPage}&searchTerm=${name}&userType=${"client"}`
    );
  };

  const {
    isLoading: loadingUsers,
    data: usersData,
    refetch,
    isRefetching: refetchingUsers,
  } = useQuery({
    queryKey: [`clients-`],
    queryFn: getUsers,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(usersData?.data?.count / perPage);

  // pagination refetch
  useEffect(() => {
    refetch();
  }, [activePage, perPage, name]);

  const updateStatusFunction = (data) => {
    return axios.patch(`/auth/update-status`, data);
  };

  const {
    mutate: updateStatusMutate,
    isLoading: loadingUpdateStatus,
    error,
  } = useMutation({
    mutationFn: updateStatusFunction,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`${"clients-"}`]);
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (clientId, status) => {
    if (!clientId) return toast.error("Error!");
    const data = {
      userId: clientId,
      status: status === "Active" ? "Suspended" : "Active",
      userType: "client",
    };

    updateStatusMutate(data);
  };

  return (
    <div>
      <p className="font-bold ">Clients</p>
      {/* table */}
      <div className="relative overflow-x-auto sm:rounded-lg  py-5 bg-white px-2 ">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="Search clients"
              defaultValue={name}
              onChange={(e) => {
                setName(e.target.value);
                setPage(1);
              }}
              className="block p-2 ps-10 text-sm text-gray-900 outline-none border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-100"
              placeholder="Search clients by name"
            />
          </div>
        </div>

        {/*  */}
        <div className="overflow-x-auto overflow-y-auto mt-3  relative sm:rounded-md bg-white  ">
          <table className="w-full text-sm text-left  text-gray-700 ">
            <thead
              className={`text-xs text-gray-800 capitalize bg-[#fffefe] border-b bg-opacity-30  `}
            >
              <tr>
                <th scope="col" className="py-2 px-5">
                  #
                </th>
                <th scope="col" className="px-6 py-1">
                  Name
                </th>
                <th scope="col" className="px-6 py-1">
                  Email
                </th>
                <th scope="col" className="px-6 py-1">
                  Phone No
                </th>
                <th scope="col" className="px-6 py-1">
                  Status
                </th>
                <th scope="col" className="px-6 py-1">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers || refetchingUsers ? (
                <tr>
                  <td colSpan={8} className="text-center pl-[50%] py-4">
                    <LoadingSpinner size={25} />
                  </td>
                </tr>
              ) : usersData?.data?.message ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-3 ">
                    {usersData?.data?.message}
                  </td>
                </tr>
              ) : (
                usersData?.data?.clients?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white border-b  hover:bg-gray-50 d"
                    >
                      <td className="w-4 p-4">{index + 1}</td>
                      <Link to={`/dashboard/clients/${item?._id}`}>
                        <td className="px-6 font-bold text-blue-500 py-4 capitalize">
                          {item?.email?.split("@")[0]}
                        </td>
                      </Link>
                      <td className="px-6 py-4">{item?.email}</td>
                      <td className="px-6 py-4">{item?.phoneNo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center capitalize">
                          <p className="capitalize">{item?.status}</p>
                        </div>
                      </td>
                      <td className=" px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/dashboard/clients/${item?._id}`}
                            className="font-medium text-blue-600 border px-3 py-1 rounded hover:bg-primary hover:bg-opacity-10 cursor-pointer  border-primary "
                          >
                            View client
                          </Link>
                          <button
                            disabled={loadingUpdateStatus}
                            className={` px-4 cursor-pointer ${
                              item.status === "Active"
                                ? "bg-yellow-800"
                                : "bg-green-500"
                            } text-light rounded disabled:cursor-not-allowed `}
                            onClick={() => {
                              onSubmitting(item?._id, item?.status);
                            }}
                          >
                            {item.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="py-3 px-3 flex justify-start ">
            <Pagination
              total={totalPages || 0}
              page={activePage}
              color="blue"
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;
