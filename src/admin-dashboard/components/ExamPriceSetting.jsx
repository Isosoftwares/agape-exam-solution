import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal, Button, Group, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function ExamPriceSetting() {
  const axios = useAxiosPrivate();
  const [deleteModal, { open, close }] = useDisclosure(false);
  const [editModal, { open: editOpen, close: editClose }] = useDisclosure(
    false
  );
  const [addModal, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [priceId, setPricingId] = useState("");
  const [disciplineName, setPricingName] = useState("");
  const [newName, setNewname] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  // add category..............................
  // add function
  const addPricing = (typedata) => {
    return axios.post(`/exam-type`, typedata);
  };

  const {
    mutate: addPricingMutate,
    isLoading: loadingPrices,
    error,
  } = useMutation({
    mutationFn: addPricing,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["prices-"]);
      addClose();
      reset();
    },
    onError: (err) => {
      console.log(err);
      const text = err?.response?.data?.message || "something went wrong";
      toast.error(text);
    },
  });
  //   end add category.........

  // add delet
  const deletePricing = (price) => {
    return axios.delete(`/exam-type/${priceId}`, price);
  };

  const { mutate: deleteMutate, isLoading: loadingDelete } = useMutation({
    mutationFn: deletePricing,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["prices-"]);
      close();
      setPricingId("");
      setPricingName("");
    },
    onError: (err) => {
      console.log(err);
      const text = err?.response?.data?.message || "something went wrong";
      toast.error(text);
    },
  });
  //   end delete category.........

  // add edit
  const editPricing = (data) => {
    return axios.patch(`/exam-type`, data);
  };

  const { mutate: editMutate, isLoading: loadingEdit } = useMutation({
    mutationFn: editPricing,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["prices-"]);
      editClose();
      setPricingId("");
      setPricingName("");
      setNewname("");
    },
    onError: (err) => {
      const text = err?.response?.data?.message || "something went wrong";
      toast.error(text);
    },
  });
  //   end delete category.........

  // get categories

  // fetching category
  const getPricings = async () => {
    return await axios.get(`/exam-type`);
  };

  const { isLoading: loadingExamPrices, data: pricingData } = useQuery({
    queryFn: getPricings,
    queryKey: [`prices-`],
    keepPreviousData: true,
  });

  const submitPricing = (data) => {
    addPricingMutate(data);
  };

  return (
    <div className="bg-light py-3 px-2 ">
      {/* delete modal */}
      <Modal
        opened={deleteModal}
        onClose={close}
        title="Delete exam type!"
        centered
      >
        <div>
          <h1 className=" py-3">
            Are sure you want to delete{" "}
            <span className="font-bold">{disciplineName}</span>
          </h1>
          <div>
            {loadingDelete ? (
              <div className="flex justify-center py-3">
                <Loader color="yellow" />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3 py-3">
                <button
                  className="px-3 py-2 bg-red-500 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                  onClick={() => {
                    deleteMutate();
                  }}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-2 bg-gray-500 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* edit  modal */}
      <Modal
        opened={editModal}
        onClose={editClose}
        title={`Current name: ${disciplineName}`}
        centered
      >
        <div>
          <div className=" py-3">
            <div>
              <div className="flex flex-col w-full ">
                <div className="flex flex-col  gap-2 w-full ">
                  <input
                    type="text"
                    placeholder="Enter new name"
                    defaultValue={newName}
                    className="border-2 w-full rounded-md py-[5px]  px-2 outline-none  focus:border-blue-700 focus:border-2 "
                    onChange={(e) => {
                      setNewname(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center gap-2 w-full ">
                  <label htmlFor="">Amount</label>
                  <input
                    type="number"
                    defaultValue={newPrice}
                    placeholder="Amount"
                    className="border w-full rounded-md py-[5px]  px-2 outline-none  focus:border-blue-700 focus:border-1 "
                    onChange={(e) => {
                      setNewPrice(e.target.value);
                    }}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.amount?.type === "required" && "Amount is required"}
                  </p>
                </div>
                <div>
                  {loadingEdit ? (
                    <div className="flex justify-center py-4">
                      <Loader color="yellow" />
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3 my-4">
                      <button
                        className="px-9 py-2 bg-primary text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                        onClick={() => {
                          if (!newName)
                            return toast.warn("Discipline name is required!");
                          editMutate({
                            examTypeId: priceId,
                            name: newName,
                            amount: newPrice,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <span
                        className="px-3 py-2 bg-gray-500 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                        onClick={editClose}
                      >
                        Cancel
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* add */}
      <Modal
        opened={addModal}
        onClose={addClose}
        title={`Add Exam type`}
        centered
      >
        <form action="" onSubmit={handleSubmit(submitPricing)} className="   ">
          <div className="flex flex-col gap-5  ">
            <div className="flex flex-col justify-center gap-2 w-full ">
              <label htmlFor="">Name</label>
              <input
                type="text"
                placeholder="Exam type name eg. proctored above 50 question"
                className="border w-full rounded-md py-[5px]  px-2 outline-none  focus:border-blue-700 focus:border-1 "
                {...register("name", {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.name?.type === "required" && "Discipline is required"}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 w-full ">
              <label htmlFor="">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                className="border w-full rounded-md py-[5px]  px-2 outline-none  focus:border-blue-700 focus:border-1 "
                {...register("amount", {
                  required: true,
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.amount?.type === "required" && "Amount is required"}
              </p>
            </div>
            <div className="flex justify-center ">
              {loadingPrices ? (
                <div className="">
                  <Loader color="yellow" />
                </div>
              ) : (
                <button
                  disabled={loadingExamPrices || loadingPrices}
                  className="bg-primary   text-light rounded-md px-5 py-[5px] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700"
                >
                  Add Exam Type
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      <div className="">
        <div className="flex justify-between items-center  border-b pb-1">
          <p className="font-bold">Exam Pricing</p>
          <button
            onClick={() => {
              addOpen();
            }}
            disabled={loadingPrices}
            className="bg-primary disabled:cursor-not-allowed disabled:bg-gray-700 text-light px-4 rounded-md  "
          >
            Add Price
          </button>
        </div>

        <div className="">
          <h1 className="capitalize">Added exam types </h1>
          <div className="overflow-x-auto overflow-y-auto mt-2  relative bg-white">
            <table className="w-full text-sm text-left text-gray-500 border">
              <thead className="text-xs  bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-1  text-gray-900 whitespace-nowrap"
                  >
                    #
                  </th>
                  <th scope="col" className="py-1 px-1">
                    Name
                  </th>
                  <th scope="col" className="py-1 px-1">
                    Amount
                  </th>
                  <th scope="col" className="py-1 px-1 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {loadingExamPrices ? (
                  <tr className="">
                    <td colSpan={17} className="py-3 ">
                      <h1 className="text-center text-lg font-bold text-primary">
                        Loading...
                      </h1>
                    </td>
                  </tr>
                ) : pricingData?.data?.message ||
                  pricingData?.data?.length < 1 ? (
                  <tr>
                    <td colSpan={7} className="text-gray-800 text-center py-3">
                      No Exam types added
                    </td>
                  </tr>
                ) : (
                  pricingData?.data?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="odd:bg-gray-50 text-dark hover:bg-gray-100 py-2"
                      >
                        <td className="border-collapse  border-slate-500 py-1 px-3">
                          {index + 1}
                        </td>

                        <td className="border-collapse  border-slate-500 py-1 px-3">
                          {item?.name}
                        </td>
                        <td className="border-collapse  border-slate-500 py-1 font-bold px-3">
                          ${item?.amount}
                        </td>
                        <td className="border-collapse text-center  gap-3 border-slate-500 py-1 px-3">
                          <span
                            onClick={() => {
                              setPricingId(item?._id);
                              setPricingName(item?.name);
                              setNewPrice(item?.amount)
                              setNewname(item?.name)
                              editOpen();
                            }}
                            className="px-3 py-2 bg-dark mx-1 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                          >
                            Edit
                          </span>

                          <span
                            onClick={() => {
                              setPricingId(item?._id);
                              setPricingName(item?.name);
                              open();
                            }}
                            className="px-3 py-2 bg-red-500 mx-2 text-light rounded-md cursor-pointer bg-opacity-90 hover:bg-opacity-100 "
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-x-auto mb-3"></div>
      </div>
    </div>
  );
}

export default ExamPriceSetting;
