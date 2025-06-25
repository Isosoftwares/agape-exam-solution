import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function DeleteOrder({ description, handleClose, link, navigateBack }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteFn = (data) => {
    return axios.delete(`${link}`, data);
  };

  const {
    mutate: deletetMutate,
    isPending: loadindDelete,
    error,
  } = useMutation({
    mutationFn: deleteFn,
    onSuccess: (response) => {
      const text = response.data.message;
      queryClient.invalidateQueries("assignments-orders");
      toast.success(text);
      handleClose();
      navigateBack ? navigate(-1) : '' 
      
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";

      toast.error(text);
    },
  });
  return (
    <div>
      <p className="font-bold text-red-500">
        Are you sure you want do delete this {description}.
      </p>

      <div>
        <div className="my-4 flex justify-center">
          <button
            onClick={() => {
              deletetMutate();
            }}
            disabled={loadindDelete}
            className="bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-light rounded-md  px-3 py-2  "
          >
            {loadindDelete ? "Deleteing..." : "Delete Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteOrder;
