import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader, Skeleton, MultiSelect } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function ClassOrderForm() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm();
  const queryClient = useQueryClient();

  const [courses, setCourses] = useState([]);
  const classTypeWatch = watch("classType");
  const noOfClassesWatch = watch("noOfClasses");

  // Adjust courses based on number of classes
  useEffect(() => {
    if (noOfClassesWatch) {
      const newCourses = Array.from({ length: noOfClassesWatch }, (_, i) => ({
        courseName: "",
        startDate: "",
        endDate: "",
        instructions: "",
        weeks: [],
      }));
      setCourses(newCourses);
    }
  }, [noOfClassesWatch]);

  // Update course details
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
    setValue("courses", updatedCourses); // Set the form value
  };

  // Get class types
  const getPricings = async () => {
    return await axios.get(`/class-type`);
  };

  const { isLoading: loadingClassPricess, data: pricingData } = useQuery({
    queryFn: getPricings,
    queryKey: [`prices-class`],
    keepPreviousData: true,
  });

  const classTypeOption =
    pricingData?.data?.map((price) => ({
      label: price?.name,
      value: price?._id,
      amount: price?.amount,
      paidWeekly: price?.paidWeekly,
    })) || [];

  const orderClass = (data) => axios.post("/classes", data);

  const { mutate: orderMutate, isPending: loadingOrder } = useMutation({
    mutationFn: orderClass,
    onSuccess: (response) => {
      const url = response.data.url;
      reset();
      toast.success(response.data.message);
      if (url !== "No url") {
        window.open(url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err?.response.data.message || "something went wrong");
    },
  });

  const onSubmitting = (data) => {
    if (invalidCoursesData(classTypeWatch?.paidWeekly, data.courses)) {
      return toast.error("Each course should have 1 selected week");
    }
    const transformedCourses = data?.courses?.map((course) => {
      if (!classTypeWatch?.paidWeekly) {
        return {
          ...course,
          weeks: [],
        };
      }
      return {
        ...course,
        weeks: course?.weeks?.map((week) => ({
          name: week,
          isPaid: false, // Assuming the default value for isPaid is false
        })),
      };
    });
    data.courses = transformedCourses;
    data.amount = calculateTotalAmount(classTypeWatch, courses);
    data.classType = classTypeWatch?.label;
    data.clientId = auth?.userId;
    data.paidWeekly = classTypeWatch?.paidWeekly || false;

    orderMutate(data);
  };

  const weeksOptions = Array.from({ length: 16 }, (_, i) => ({
    value: `week-${i + 1}`,
    label: `Week ${i + 1}`,
    isPaid: false,
  }));

  const calculateTotalAmount = (classTypeWatch, courses) => {
    if (!classTypeWatch?.paidWeekly) {
      return classTypeWatch?.amount * noOfClassesWatch;
    }
    const costPerWeek = classTypeWatch?.amount;

    const totalWeeks = courses.reduce((acc, course) => {
      return acc + (course.weeks ? course.weeks.length : 0);
    }, 0);

    // Return the total cost
    return totalWeeks * costPerWeek;
  };

  const invalidCoursesData = (paidWeekly, courses) => {
    if (paidWeekly) {
      const hasEmptyWeeks = courses.some(
        (course) => !course.weeks || course.weeks.length === 0
      );

      if (hasEmptyWeeks) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="mt-5 min-h-[] py-3 px-2">
      {/* form */}
      <form action="" onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 justify-between">
          <div className="bg-light w-full lg:basis-3/4 px-2 rounded-md shadow-sm border-2 shadow-cyan-50 min-h-[]">
            <p className="font-bold underline text-lg mt-3 underline-offset-4">
              Step 1 of 2 - Class type
            </p>
            <div className="flex flex-col">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="">
                  Class Type{" "}
                  <span className="text-red-500">
                    <sup>*</sup>
                  </span>
                </label>
                <Skeleton visible={loadingClassPricess}>
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        options={classTypeOption}
                        value={classTypeOption.find(
                          (option) => option.value === field.value
                        )}
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption)
                        }
                      />
                    )}
                  />
                </Skeleton>
                <p className="text-red-500 text-xs">
                  {errors.classType?.type === "required" &&
                    "Class type is required"}
                </p>
              </div>

              {/* Dynamic Course Fields */}
              <div className={`${!classTypeWatch && "hidden"} mt-5`}>
                <p className="font-bold underline text-lg underline-offset-4">
                  Step 2 of 2 - Specific Details
                </p>

                {/* School Details */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="">
                    School Name{" "}
                    <span className="text-red-500">
                      <sup>*</sup>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("schoolName", { required: true })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.schoolName?.type === "required" &&
                      "School name is required"}
                  </p>

                  <label htmlFor="">
                    School Link{" "}
                    <span className="text-red-500">
                      <sup>*</sup>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("schoolLink", { required: true })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.schoolLink?.type === "required" &&
                      "School link is required"}
                  </p>

                  <label htmlFor="">
                    User name/ Email{" "}
                    <span className="text-red-500">
                      <sup>*</sup>
                    </span>
                  </label>
                  <input
                    type="email"
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("email", { required: true })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.email?.type === "required" && "Email is required"}
                  </p>

                  <label htmlFor="">
                    Password{" "}
                    <span className="text-red-500">
                      <sup>*</sup>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("password", { required: true })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.password?.type === "required" &&
                      "Password is required"}
                  </p>

                  <label htmlFor="">Additional Instructions</label>
                  <textarea
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("instructions")}
                    rows={4}
                  />
                </div>

                {/* Other existing fields */}
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="">
                    No of Classes{" "}
                    <span className="text-red-500">
                      <sup>*</sup>
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                    {...register("noOfClasses", { required: true })}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.noOfClasses?.type === "required" &&
                      "No of classes is required"}
                  </p>
                </div>

                {courses?.map((course, index) => (
                  <div
                    key={index}
                    className="my-4 bg-gray-100 border-secondary border px-2 py-2 rounded-md  "
                  >
                    <h3 className="font-bold underline ">Course {index + 1}</h3>
                    <div className="flex flex-col gap-2">
                      <label>Course Name</label>
                      <input
                        type="text"
                        required
                        className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                        value={course?.courseName}
                        onChange={(e) =>
                          handleCourseChange(
                            index,
                            "courseName",
                            e.target.value
                          )
                        }
                      />
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full">
                          <label>Start Date</label>
                          <input
                            type="date"
                            required
                            className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                            value={course.startDate}
                            onChange={(e) =>
                              handleCourseChange(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label>End Date</label>
                          <input
                            type="date"
                            className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
                            value={course.endDate}
                            onChange={(e) =>
                              handleCourseChange(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {classTypeWatch?.paidWeekly && (
                        <>
                          <label>Select Week(s) to be done</label>
                          <MultiSelect
                            data={weeksOptions}
                            value={course.weeks}
                            onChange={(selected) => {
                              handleCourseChange(index, "weeks", selected);
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className={`${
                      loadingOrder && "cursor-not-allowed bg-indigo-300"
                    } bg-indigo-600 text-white my-4 py-2 px-4 rounded-md shadow-sm`}
                    disabled={loadingOrder}
                  >
                    {loadingOrder ? (
                      <div className="flex flex-row gap-1 justify-center">
                        <Loader size="sm" className="text-gray-50" />
                        Processing...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full lg:basis-1/4 ">
            <div className="bg-light w-full lg:basis-1/4 px-2 rounded-md shadow-sm border-2 shadow-cyan-50 min-h-[200px] ">
              <p className="font-bold underline underline-offset-4">
                Order Summary
              </p>
              <div className=" ">
                <p>
                  Order Type: <span className="font-bold ">Class</span>
                </p>
                <p className="font-bold  ">{classTypeWatch?.label}</p>
              </div>
              <table>
                <tr className="">
                  <td>Rate</td>
                  <td className="font-bold  ">: $ {classTypeWatch?.amount}</td>
                </tr>
              </table>
              <div className="flex justify-between border-t-2 mt-5 ">
                <p className="font-bold">Total:</p>
                <p
                  className={`${!classTypeWatch?.value && "hidden"}  font-bold`}
                >
                  ${calculateTotalAmount(classTypeWatch, courses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ClassOrderForm;
