import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

function ReAssignWriter({
  link,
  closeModal,
  invalidate,
  _id,
  writerAmount,
  writerDeadline,
  orderType,
}) {
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  // get writers
  const getAllWriters = () => {
    return axios.get(`/user?role=${"Writer"}&isPaginated=${false}`);
  };

  const { isLoading: loadingWriters, data: writersData } = useQuery({
    queryKey: [`allWriters-add-class`],
    queryFn: getAllWriters,
    keepPreviousData: true,
  });

  let writers =
    writersData?.data?.users?.map((writer) => {
      const container = {};
      container.label = writer?.userName;
      container.value = writer?._id;
      return container;
    }) || [];

  const reassignWriter = (data) => {
    return axios.patch(`${link}`, data);
  };

  const {
    mutate: reassignWriterMutate,
    isPending: reassignWriterLoading,
    error,
  } = useMutation({
    mutationFn: reassignWriter,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`${invalidate}`]);
      closeModal();
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    if (!link) return toast.error("Error! Close the modal and try again");

    data.orderId = _id;
    reassignWriterMutate(data);
  };
  return (
    <div className="min-h-[300px]">
      <form onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col w-full">
          <label
            htmlFor=""
            className="block text-sm font-semibold text-gray-600 mb-1"
          >
            Writers
            <span className="text-red-500">
              <sup>*</sup>
            </span>
          </label>
          {loadingWriters ? (
            <div>Loading...</div>
          ) : (
            <Controller
              name="writerId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={writers}
                  value={writers.find((writer) => writer.value === field.value)}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                  }}
                />
              )}
            />
          )}

          <p className="text-red-500 text-xs mt-1 ">
            {errors.writerId?.type === "required" && "Please select a writer"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Writer Amount</label>
          <input
            type="number"
            min={0}
            defaultValue={writerAmount}
            className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
            {...register("writerAmount", {
              required: true,
            })}
          />
          <p className="text-red-500 text-xs">
            {errors.writerAmount?.type === "required" &&
              "Writer Amount is required"}
          </p>
        </div>
        <div className={` ${orderType !== "assignment" && 'hidden'} flex flex-col gap-2`}>
          <label htmlFor="">Writer Deadline date</label>
          <input
            type="datetime-local"
            defaultValue={new Date(writerDeadline)}
            className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
            {...register("writerDeadline", {
              required: orderType === "assignment" ? true : false,
            })}
          />
          <p className="text-red-500 text-xs">
            {errors.writerDeadline?.type === "required" &&
              "Writer deadline date is required"}
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 mt-[50px] ">
          <button
            disabled={reassignWriterLoading || !link}
            type="submit"
            className={`  bg-primary disabled:bg-gray-600   text-light rounded-md cursor-pointer hover:bg-opacity-100 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Assign
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            disabled={reassignWriterLoading}
            className={`  bg-gray-800 disabled:bg-gray-600  text-light rounded-md cursor-pointer hover:bg-opacity-90 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReAssignWriter;
