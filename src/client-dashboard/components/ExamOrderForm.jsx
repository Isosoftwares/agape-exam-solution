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

function ExamOrderForm() {
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

  const examTypeWatch = watch("examType");

  // get exam types
  const getPricings = async () => {
    return await axios.get(`/exam-type`);
  };

  const { isLoading: loadingExamPrices, data: pricingData } = useQuery({
    queryFn: getPricings,
    queryKey: [`prices-exam`],
    keepPreviousData: true,
  });

  const examTypeOptions =
    pricingData?.data?.map((price) => {
      const container = {};
      (container.label = price?.name),
        (container.value = price?.name),
        (container.amount = price?.amount);
      return container;
    }) || [];

  const timezones = timeZones();

  const orderExam = (examData) => {
    return axios.post("/exams", examData);
  };

  const { mutate: orderMutate, isPending: loadingOrder, error } = useMutation({
    mutationFn: orderExam,
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
    data.amount = examTypeWatch?.amount;
    data.examType = examTypeWatch?.value;
    data.clientId = auth?.userId;
    orderMutate(data);
  };
  return (
    <div className="mt-5 min-h-[500px]  py-3 px-2 ">
      {/* form */}
      <form action="" onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between">
          <div className="bg-light w-full lg:basis-3/4 px-2 rounded-md shadow-sm border-2 shadow-cyan-50 min-h-[300px] ">
            <p className="font-bold text-lg mt-3 underline underline-offset-4">
              Step 1 of 2 - Exam Type
            </p>
            <div className="flex flex-col ">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="">
                  Exam Type
                  <span className="text-red-500">
                    <sup>*</sup>
                  </span>
                </label>
                <Controller
                  name="examType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={examTypeOptions}
                      value={examTypeOptions.find(
                        (examTypeOptions) =>
                          examTypeOptions.value === field.value
                      )}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                      }}
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {errors.examType?.type === "required" &&
                    "Exam type is required"}
                </p>
              </div>
              <div className={`${!examTypeWatch && "hidden"} mt-5 `}>
                <p className="font-bold underline text-lg underline-offset-4">
                  Step 2 of 2 - Exam Details
                </p>
                <div className="flex flex-col w-full gap-2 my-2">
                  <Controller
                    control={control}
                    name="date"
                    defaultValue={null}
                    rules={{ required: true }} // Set the required validation rule
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        className="min-w-full"
                        clearable
                        label="Exam Date and Time"
                        placeholder="Pick date and time"
                        maw={400}
                        mx="auto"
                        minDate={minimumDate}
                        required
                        error={!!errors.deadline} // Apply error state based on validation
                        errorLabel={errors.deadline && "This field is required"} // Error message for required validation
                      />
                    )}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.examDate?.type === "required" &&
                      "Exam date is required"}
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
                    rules={{ required: false }}
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
                </div>

                {/* login details */}
                <div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="">
                      School link
                      <span className="text-red-500">
                        <sup>*</sup>
                      </span>
                    </label>

                    <input
                      type="text"
                      className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                      {...register("schoolLink", {
                        required: true,
                      })}
                    />
                    <p className="text-red-500 text-xs">
                      {errors.schoolLink?.type === "required" &&
                        "School Link is required"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="">
                      Login Email / username
                      <span className="text-red-500">
                        <sup>*</sup>
                      </span>
                    </label>

                    <input
                      type="text"
                      className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                      {...register("email", {
                        required: true,
                      })}
                    />
                    <p className="text-red-500 text-xs">
                      {errors.email?.type === "required" && "Email is required"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="">
                      Password
                      <span className="text-red-500">
                        <sup>*</sup>
                      </span>
                    </label>

                    <input
                      type="text"
                      className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                      {...register("password", {
                        required: true,
                      })}
                    />
                    <p className="text-red-500 text-xs">
                      {errors.password?.type === "required" &&
                        "Password is required"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="">Instructions</label>
                  <textarea
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border "
                    placeholder="Add any additional special instructions."
                    {...register("instructions", {
                      required: false,
                    })}
                  ></textarea>
                </div>

                {/* buttons */}
                <div className="flex justify-center py-10">
                  {loadingOrder ? (
                    <div className="flex gap-1 items-center">
                      <span className="primary">Processing...</span>
                      <Loader color="blue" size={20} />
                    </div>
                  ) : (
                    <button className="bg-primary text-light px-6 py-2 rounded-md hover:bg-gray-800 ">
                      Place Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* order summary */}
          <div className=" w-full lg:basis-1/4 ">
            <div className="bg-light w-full lg:basis-1/4 px-2 rounded-md shadow-sm border-2 shadow-cyan-50 min-h-[200px] ">
              <p className="font-bold underline underline-offset-4">
                Order Summary
              </p>
              <div className=" ">
                <p>
                  Order Type: <span className="font-bold ">Exam</span>
                </p>
                <p className="font-bold  ">{examTypeWatch?.label}</p>
              </div>
              <table>
                <tr className="">
                  <td>Rate</td>
                  <td className="font-bold  ">: $ {examTypeWatch?.amount}</td>
                </tr>
              </table>
              <div className="flex justify-between border-t-2 mt-5 ">
                <p className="font-bold">Total:</p>
                <p
                  className={`${!examTypeWatch?.value && "hidden"}  font-bold`}
                >
                  ${examTypeWatch?.amount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExamOrderForm;
