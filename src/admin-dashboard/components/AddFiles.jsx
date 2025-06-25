import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "@mantine/core";

function AddFiles({ orderId, handleClose, link }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const [sending, setSending] = useState(false);
  const handleUpload = () => {
    setSending(!sending);
    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });

    axios
      .patch(`${link}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        queryClient.invalidateQueries([`assignments-details-${orderId}`]);
        queryClient.invalidateQueries([`aassignments-orders`]);
        toast.success(response?.data?.message);
        handleClose();
        setSending(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setSending(false);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 py-6">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="py-2 px-1 rounded-md bg-gray-100 w-full"
      />
      {sending ? (
        <div>
          <Loader color="yellow" />
        </div>
      ) : (
        <button
          onClick={() => {
            handleUpload();
          }}
          disabled={selectedFiles.length === 0}
          className={`${
            selectedFiles.length > 0
              ? "bg-primary hover:bg-dark-700 hover:text-light"
              : "bg-gray-400 cursor-not-allowed"
          } text-white font-bold py-2 px-6 rounded`}
        >
          Upload
        </button>
      )}
    </div>
  );
}

export default AddFiles;
