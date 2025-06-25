import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { DateInput } from "@mantine/dates";
import { toast } from "react-toastify";
import { Loader } from "@mantine/core";

function EditClientSubscription({ clientSubscription, handleClose, clientId }) {
  const axios = useAxiosPrivate();
  const [expiryDate, setExpiryDate] = useState(
    new Date(clientSubscription?.expiryDate)
  );
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const getSubscriptions = () => {
    return axios.get(`/subscriptions?serviceName=${""}`);
  };

  const {
    isLoading: loadingSubs,
    data: subscriptionsData,
    refetch,
    isRefetching: refetchingSubs,
  } = useQuery({
    queryKey: [`subscriptions`],
    queryFn: getSubscriptions,
    keepPreviousData: true,
  });

  let subOption =
    subscriptionsData?.data?.map((sub) => {
      const container = {};
      container.label = sub?.name;
      container.value = sub?._id;
      return container;
    }) || [];

  const editSubscription = (data) => {
    return axios.patch("/client-subscriptions/edit", data);
  };

  const {
    mutate: subMutate,
    isPending: loadingSub,
    error,
  } = useMutation({
    mutationFn: editSubscription,

    onSuccess: (response) => {
      queryClient.invalidateQueries([`user-${clientId}`]);
      handleClose();
      const text = response.data.message;
      toast.success(text);
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    data.expiryDate = expiryDate;
    data.clientSubscriptionId = clientSubscription?._id;
    subMutate(data);
  };

  return (
    <div className="">
      <div className="">
        <div className="w-full min-h-[510px] ">
          <form
            action=""
            className="py-2 text-darktext "
            onSubmit={handleSubmit(onSubmitting)}
          >
            <div className="flex flex-col w-full ">
              <div className="flex flex-col w-full">
                <label htmlFor="" className="text-sm">
                  Subscription
                  <span className="text-red-500">
                    <sup>*</sup>
                  </span>
                </label>
                <div>
                  {loadingSubs ? (
                    <div>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <Controller
                      name="subscriptionId"
                      defaultValue={clientSubscription?.subscriptionId?._id}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={subOption}
                          value={subOption.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value);
                          }}
                        />
                      )}
                    />
                  )}
                </div>

                <p className="text-red-500 text-xs">
                  {errors.subscriptionId?.type === "required" &&
                    "Subscription is required"}
                </p>
              </div>

              <div className="flex pt-3 flex-col">
                <h1 className="text-sm">
                  Expiry Date <span className="text-red-500">*</span>
                </h1>

                <DateInput
                  value={expiryDate}
                  onChange={setExpiryDate}
                  placeholder="ExpiryDate"
                  size="md"
                />
                <p className="text-red-500 text-xs">
                  {errors.retailPrice?.type === "required" &&
                    "Retail price is required"}
                </p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              {loadingSub ? (
                <div className="flex justify-center pr-6 items-center">
                  <Loader color="yellow" />
                </div>
              ) : (
                <input
                  disabled={loadingSub}
                  type="Submit"
                  value="Submit"
                  className={` bg-primary disabled:bg-gray-600 bg-opacity-100  text-light rounded-md cursor-pointer hover:bg-opacity-90 ease-in-out duration-300 font-semibold   px-6 py-2  `}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditClientSubscription;
