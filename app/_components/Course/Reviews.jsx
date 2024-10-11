import React from "react";
import { mapColor } from "@/app/_lib/util/map";

import Rating from "@mui/material/Rating";
import Divider from "@/app/_components/Divider";
import LeaveReview from "./LeaveReview";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  if (year !== currentYear) {
    return `${formattedDate}, ${year}`;
  }

  return formattedDate;
};

const Reviews = ({ reviews }) => {
  return (
    <>
      <Divider />

      <div className="gap-3 flex justify-between">
        <h1 className="text-xl my-3">Reviews ({reviews.length})</h1>
        <LeaveReview />
      </div>

      <div className="custom-scroll max-h-[200vh] overflow-y-scroll grid lg:grid-cols-2 gap-4 pr-2">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border border-gray-300 p-3 rounded-lg bg-gray-100"
          >
            <div className="text-lg flex justify-between">
              <div className="flex flex-col gap-px">
                <h1>{review.class}</h1>
                <Rating
                  value={review.rating}
                  defaultValue={review.rating}
                  precision={0.5}
                  readOnly
                  style={{ opacity: "90%" }}
                />
              </div>
              <div className="text-right">
                <h2 className="text-gray-400">
                  {formatTimestamp(review.date)}
                </h2>{" "}
                {review.grade && (
                  <p>
                    <span className={`${mapColor(review.grade)}`}>
                      {review.grade}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <hr></hr>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Reviews;
