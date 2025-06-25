import React from "react";
import { format } from "timeago.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { IoSend } from "react-icons/io5";
function Conversation({ messages, clientId }) {
  const axios = useAxiosPrivate();
  const scroll = useRef();
  const [sent, setSent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // upload function
  const uploadMessage = (message) => {
    return axios.post("/chat", message);
  };

  const {
    mutate: messageMutate,
    isLoading: messageLoading,
    error,
  } = useMutation({
    mutationFn: uploadMessage,
    onSuccess: (response) => {
      // queryClient.invalidateQueries([`messages--`]);
      reset();
    },
    onError: (err) => {
      const text = err?.response?.data?.message;
      toast.error(text);

      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const submitMessage = (data) => {
    data.clientId = clientId;
    data.senderId = clientId;
    setSent(data.message);
    messageMutate(data);
  };

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [sent, messages?.length]);

  return (
    <div>
      <div className="flex flex-col justify-between ">
        <div className="flex flex-col min-h-[330px] bg-chatBg no-scrollbar  max-h-[300px]  overflow-y-auto -auto ">
          <div className="text-white float-left bg-primary w-[70%] m-2  px-2 py-1 rounded-md ">
            <p>
              Hi, Welcome to Agape smart solutions. Send a message and we will
              get back in a minute!
            </p>
          </div>
          <div className="flex flex-col">
            {messages?.map((message, index) => {
              return (
                <div
                  key={index}
                  ref={scroll}
                  className={
                    message.senderId === clientId
                      ? "m-1 bg-[#379237] dark:bg-[#101835]  p-1  text-white self-end w-auto  inline-block max-w-[85%]  rounded-br-lg rounded-bl-lg rounded-tl-lg md:round-tr-lg  "
                      : "text-white  bg-primary/70  m-1  p-2  self-start w-auto inline-block max-w-[85%]  rounded-br-lg rounded-bl-lg rounded-tr-lg  md:round-tr-lg "
                  }
                >
                  <p className="">{message?.message}</p>
                  <h1 className="text-xs text-right">
                    {format(message?.createdAt)}
                  </h1>
                  <h1 className="text-[15px] text-right"> </h1>
                </div>
              );
            })}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(submitMessage)}
          className="grid grid-cols-1 gap-6 "
        >
          <div className="flex gap-2 items-center border m-2 rounded-md px-2 py-2">
            <input
              placeholder="Type message..."
              id="message"
              name="message"
              rows="1"
              {...register("message", {
                required: true,
              })}
              className=" py-2 px-3  block text-dark w-full  focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></input>

            <button
              disabled={messageLoading}
              className="bg-primary py-2 px-3 rounded-md disabled:bg-gray-500  hover:bg-secondary text-light hover:text-light "
            >
              <IoSend />
            </button>
          </div>
          <div></div>
        </form>
      </div>
    </div>
  );
}

export default Conversation;
