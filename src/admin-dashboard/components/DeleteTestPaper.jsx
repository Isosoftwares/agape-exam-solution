import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function DeleteTestPaper({ testPaper, handleClose }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteFn = (data) => {
    return axios.delete(`/test-paper/${testPaper?._id}`, data);
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
      handleClose();
      navigate(-1); 
    },
    onError: (err) => {
      const text = err?.response.data.message || "Something went wrong";
      toast.error(text);
    },
  });
  return (
    <div>
      <p className="font-bold text-red-500">
        Are you sure you want to delete this test paper:
      </p>
      <p className="font-bold">Name: {testPaper?.name}</p>
      <p className="font-bold">Service: {testPaper?.subscriptionType}</p>

      <div>
        <div className="my-4 flex justify-center">
          <button
            onClick={() => {
              deletetMutate();
            }}
            disabled={loadindDelete}
            className="bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-light rounded-md  px-3 py-2  "
          >
            {loadindDelete ? "Deleteing..." : "Delete Test Paper"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTestPaper;
