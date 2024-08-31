import React from "react";
import Rating from "@mui/material/Rating";

const CoursesCard = ({ data }) => {
  return (
    <div className="flex flex-col border rounded-lg min-h-24 py-4 px-4 hover:border-blue-500">
      <h1 className="text-xl font-bold">
        <span className="text-blue-500/90">{data.course} - </span>
        {data.title}
      </h1>
      <h1 className="text-gray-500/90 font-medium text-xl">{data.college}</h1>

      <h1 className="text-lg">{data.identifier}</h1>
      <h1 className="text-lg">{data.description}</h1>
      <h1 className="text-lg">{data.price}</h1>
      <h1 className="text-lg">{data.units}</h1>
      <h1 className="text-lg">{data.avgRating}</h1>
      <h1 className="text-lg">{data.avgGrade}</h1>
      <h1 className="text-lg">{data.areas}</h1>
      <h1 className="text-lg">{data.sectionCount}</h1>
    </div>
  );
};

export default CoursesCard;
