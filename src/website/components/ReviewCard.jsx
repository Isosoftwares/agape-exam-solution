import { Rating } from "@mantine/core";
import React from "react";

function ReviewCard({ review }) {
  return (
    <div className="p-8 bg-secondary bg-opacity-50 border border-gray-100 shadow-md aspect-auto rounded-lg shadow-gray-600/10  ">
      <div className="flex gap-4 items-start">
        <img
          className="w-12 h-12 rounded-full"
          src={review?.profile}
          alt="user avatar"
          width="400"
          height="400"
          loading="lazy"
        />
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h6 className="text-lg font-medium text-gray-800">{review?.name}</h6>
            <Rating value={review?.stars} readOnly />
          </div>
        </div>
      </div>
      <p className="mt-8 text-gray-900">{review?.comment}</p>
    </div>
  );
}

export default ReviewCard;
