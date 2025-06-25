import React from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

function ViewSubscription({ subscription, handleEdit }) {
  const splitStringIntoArray = (str) => {
    return str.split(",").map((item) => item.trim());
  };

  return (
    <div>
      <table>
        <tr>
          <td>Subscription name </td>
          <td className="font-bold">: {subscription?.name}</td>
        </tr>
        <tr>
          <td>Service Name</td>
          <td className="font-bold">: {subscription?.serviceName}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td className="font-bold">: ${subscription?.amount}</td>
        </tr>
      </table>
      <div>
        <p>Description:</p>
        <p className="w-full border px-1 py-3 rounded-md " name="" id="">
          {subscription?.description}
        </p>
      </div>
      <div>
        <p>Points:</p>
        <div>
          {splitStringIntoArray(subscription?.points)?.map((item, index) => {
            return (
              <div key={index} className="flex gap-2 items-center">
                <IoCheckmarkCircleSharp size={18} color="blue" />
                <p className="capitalize">{item}</p>
              </div>
            );
          })}
        </div>
        <p
          className="capitalize text-primary underline underline-offset-2 cursor-pointer  "
          onClick={() => {
            handleEdit();
          }}
        >
          edit subscription
        </p>
      </div>
    </div>
  );
}

export default ViewSubscription;
