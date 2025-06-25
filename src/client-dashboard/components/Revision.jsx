import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

function Revision({ closeModal, _id, revisionReason }) {
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

  const takeTorevision = (data) => {
    return axios.patch(`/assignments/take-to-revision`, data);
  };

  const {
    mutate: revisionMutate,
    isPending: loadingRevision,
    error,
  } = useMutation({
    mutationFn: takeTorevision,
    onSuccess: (response) => {
      queryClient.invalidateQueries([`assignments-orders`]);
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
    data.assignmentId = _id;
    revisionMutate(data);
  };
  return (
    <div className="min-h-[]">
      <form onSubmit={handleSubmit(onSubmitting)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Revision reason</label>
          <textarea
            className="w-full p-[5px] focus:border-1 outline-none rounded-md focus:border-blue-300 border"
            name=""
            rows={5}
            defaultValue={revisionReason}
            id=""
            {...register("revisionReason", {
              required: true,
            })}
          ></textarea>

          <p className="text-red-500 text-xs">
            {errors.revisionReason?.type === "required" &&
              "Please provide reason for revision"}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            disabled={loadingRevision}
            type="submit"
            className={`  bg-primary disabled:bg-gray-600   text-light rounded-md cursor-pointer hover:bg-opacity-100 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Submit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            disabled={loadingRevision}
            className={`  bg-gray-800 disabled:bg-gray-600  text-light rounded-md cursor-pointer hover:bg-opacity-90 ease-in-out duration-300 font-semibold   px-6 py-2  `}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Revision;
