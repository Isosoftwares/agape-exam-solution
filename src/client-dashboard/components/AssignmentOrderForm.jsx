import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { addHours, startOfMinute } from "date-fns";
import { DateTimePicker } from "@mantine/dates";
import timeZones from "../../utils/timeZones";
import { Loader } from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function AssignmentOrderForm() {
  const minimumDate = addHours(startOfMinute(new Date()), 1);
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const queryClient = useQueryClient();

  const workSizeWatch = watch("workSize");
  const workSizeTypeWatch = watch("workSizeType") || "Pages";

  const timezones = timeZones();

  // get pricing types
  const getPricings = async () => {
    return await axios.get(`/assignment-type`);
  };

  const { isLoading: loadingExamPrices, data: pricingData } = useQuery({
    queryFn: getPricings,
    queryKey: [`prices-assignment payment`],
    keepPreviousData: true,
  });

  function getAmountByWorkSizeType(workSizeType) {
    const trimmedWorkSizeType = () => {
      if (workSizeType === "Pages") {
        return "Page";
      } else if (workSizeType === "Words") {
        return "Page";
      } else if (workSizeType === "Slides") {
        return "Slide";
      } else {
        return "Page";
      }
    };

    const pricingItem = pricingData?.data?.find(
      (item) => item.name === trimmedWorkSizeType()
    );
    return pricingItem ? pricingItem.amount : null;
  }

  const price = getAmountByWorkSizeType(workSizeTypeWatch);

  const calculateTotalAmount = () => {
    if (workSizeTypeWatch === "Pages") {
      return getAmountByWorkSizeType(workSizeTypeWatch) * workSizeWatch;
    } else if (workSizeTypeWatch === "Slides") {
      return getAmountByWorkSizeType(workSizeTypeWatch) * workSizeWatch;
    } else if (workSizeTypeWatch === "Words") {
      // find pages
      const totalPages = Math.ceil(workSizeWatch / 250);
      return getAmountByWorkSizeType("Pages") * totalPages;
    } else {
      return 0;
    }
  };
  // end..........

  const assignmentOrder = (examData) => {
    return axios.post("/assignments", examData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const { mutate: orderMutate, isPending: loadingOrder, error } = useMutation({
    mutationFn: assignmentOrder,
    onSuccess: (response) => {
      const url = response.data.url;
      reset();
      const text = response.data.message;
      toast.success(text);
      if (url !== "No url") {
        window.open(url, "_blank");
      }
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = (data) => {
    data.amount = calculateTotalAmount()?.toFixed(2);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("instructions", data.instructions);
    formData.append("dueDate", data.dueDate);
    formData.append("schoolName", data.schoolName);
    formData.append("timezone", data.timeZone);
    formData.append("clientId", auth?.userId);
    formData.append("amount", data?.amount);
    formData.append("workSize", data?.workSize);
    formData.append("workSizeType", data?.workSizeType);
    formData.append("type", data?.type);

    for (const file of data.files) {
      formData.append("files", file);
    }

    orderMutate(formData);
  };

  return (
    <div className="mt-5 min-h-[500px] py-3 px-2">
      <form action="" onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between">
          <div className="bg-light w-full lg:basis-3/4 px-2 rounded-md shadow-sm shadow-cyan-50 border-2 min-h-[300px]">
            <p className="font-bold underline underline-offset-4">
              Assignment/ essay order{" "}
            </p>
            <div className="flex flex-col ">
              <div className="flex flex-col gap-2">
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                  {...register("title", {
                    required: false,
                  })}
                />
                <p className="text-red-500 text-xs">
                  {errors.title?.type === "required" && "Title is required"}
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 mb-4">
                <label htmlFor="">Type</label>
                <select
                  name=""
                  id=""
                  defaultValue={"Assignment"}
                  className="w-full p-[5px] py-3 focus:border-1 outline-none rounded-md focus:border-blue-400 border "
                  {...register("type", {
                    required: true,
                  })}
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Discusion">Discusion</option>
                  <option value="Presentation(PPT)">Presentation(PPT)</option>
                </select>
              </div>
              <div className="md:flex gap-2">
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="">Select work size type</label>
                  <select
                    name=""
                    id=""
                    defaultValue={"Pages"}
                    className="w-full p-[5px] py-4 focus:border-1 outline-none rounded-md focus:border-blue-400 border "
                    {...register("workSizeType", {
                      required: false,
                    })}
                  >
                    <option value="Pages">Pages</option>
                    <option value="Words">Words</option>
                    <option value="Slides">Slides</option>
                  </select>
                </div>
                <div className="flex flex-col w-full gap-2">
                  {workSizeTypeWatch === "Words" ? (
                    <label htmlFor="">
                      No of {workSizeTypeWatch} (
                      {workSizeTypeWatch === "Words" &&
                        workSizeWatch &&
                        `~${Math.ceil(workSizeWatch / 250)} Page${
                          Math.ceil(workSizeWatch / 250) >= 2 ? "s" : ""
                        }`}
                      ){" "}
                    </label>
                  ) : (
                    <label htmlFor="">No of {workSizeTypeWatch}</label>
                  )}
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    step="any"
                    className="w-full py-2 p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-400 border "
                    {...register("workSize", {
                      required: true,
                    })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.workSize?.type === "required" &&
                      "Work size is required"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">Instructions</label>
                <textarea
                  rows={4}
                  className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                  placeholder="Add instructions."
                  {...register("instructions", {
                    required: true,
                  })}
                ></textarea>
                <p className="text-red-500 text-xs">
                  {errors.instructions?.type === "required" &&
                    "Instructions are required"}
                </p>
              </div>
              <div className="mb-4 w-full">
                <div className="flex gap-2 items-center ">
                  <label className="block text-md font-medium text-gray-700">
                    Uploads
                    <span>
                      <sup className="text-red-500 text-md">*</sup>
                    </span>
                  </label>
                </div>
                <input
                  type="file"
                  multiple
                  className={`rounded-md file:mr-4 file:py-[11px] file:px-4 file:border-0 shadow file:text-md file:font-semibold file:text-violet-700 bg-primary text-light`}
                  {...register("files", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col w-full gap-2 my-2">
                <Controller
                  control={control}
                  name="dueDate"
                  defaultValue={null}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      className="min-w-full"
                      clearable
                      label="Deadline Select Date and Time"
                      placeholder="Pick date and time"
                      maw={400}
                      mx="auto"
                      minDate={minimumDate}
                      required
                      error={!!errors.dueDate}
                      errorLabel={errors.dueDate && "This field is required"}
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {errors.dueDate?.type === "required" &&
                    "Deadline is required"}
                </p>
              </div>
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="">
                  Time Zone
                  <span className="text-red-500">
                    <sup>*</sup>
                  </span>
                </label>
                <Controller
                  name="timeZone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={timezones}
                      value={timezones.find(
                        (timezone) => timezone.value === field.value
                      )}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption.value);
                      }}
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {errors.timeZone?.type === "required" && "Select time zone"}
                </p>
              </div>
              <div className="flex justify-center py-10">
                {loadingOrder ? (
                  <div className="flex gap-1 items-center">
                    <span className="primary">Processing...</span>
                    <Loader color="blue" size={20} />
                  </div>
                ) : (
                  <button className="bg-primary text-light px-6 py-2 rounded-md hover:bg-gray-800">
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:basis-1/4">
            <div className="bg-light w-full lg:basis-1/4 px-2 rounded-md shadow-sm shadow-cyan-50 min-h-[200px] border-2">
              <p className="font-bold underline underline-offset-4">
                Order Summary
              </p>
              <div className="">
                <p>Order Type:</p>
                <p className="font-bold">Assignment/ essay</p>
              </div>
              <table>
                <tr className="">
                  <td>Rate</td>
                  <td className="font-bold">
                    : ${price} Per{" "}
                    {workSizeTypeWatch === "Words"
                      ? "Page"
                      : workSizeTypeWatch?.trim()?.endsWith("s")
                      ? workSizeTypeWatch?.trim().slice(0, -1)
                      : workSizeTypeWatch?.trim()}
                  </td>
                </tr>
              </table>
              <div className="flex justify-between border-t-2 mt-5">
                <p className="font-bold mt-4">Total:</p>
                <p className={`${!workSizeWatch && "hidden"} mt-4 font-bold`}>
                  ${calculateTotalAmount()?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AssignmentOrderForm;
