import React from "react";
import Rating from "@mui/material/Rating";

const CollegeCard = ({ college, rating, ratings }) => {
  return (
    <div className="flex flex-col border rounded-lg min-h-24 py-4 px-4 hover:border-blue-500">
      <h1 className="text-lg">{college}</h1>
      <div className="flex gap-1">
        <p className="text-yellow-500">{rating.toFixed(1)}</p>
        <Rating
          defaultValue={rating}
          value={rating}
          precision={0.5}
          readOnly
          style={{ opacity: "90%" }}
        />
      </div>
      <h2 className="text-gray-500">{ratings.toLocaleString()} reviews</h2>
    </div>
  );
};

export default CollegeCard;
