import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DeleteSubscription({ subscription, handleClose }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const deleteFn = (data) => {
    return axios.delete(`/subscriptions/${subscription?._id}`, data);
  };

  const {
    mutate: deletetMutate,
    isPending: loadindDelete,
    error,
  } = useMutation({
    mutationFn: deleteFn,
    onSuccess: (response) => {
      const text = response.data.message;
      toast.success(text);
      queryClient.invalidateQueries([`subscriptions`]);
      handleClose();
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";

      toast.error(text);
    },
  });
  return (
    <div>
      <p className="font-bold">
        Are you sure you want to delete this subscription:
      </p>
      <p className="font-bold">Name:{subscription?.name}</p>
      <p className="font-bold">Service:{subscription?.serviceName}</p>
      <p className="font-bold">AMount: ${subscription?.amount}</p>

      <div>
        <div className="my-4 flex justify-center">
          <button
            onClick={() => {
              deletetMutate();
            }}
            disabled={loadindDelete}
            className="bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-light rounded-md  px-3 py-2  "
          >
            {loadindDelete ? "Deleteing..." : "Delete Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubscription;
