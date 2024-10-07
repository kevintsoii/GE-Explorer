import React from "react";
import Rating from "@mui/material/Rating";
import { mapGrade, mapColor } from "../../_lib/util/map";
import Link from "next/link";

const CoursesCard = ({ data }) => {
  return (
    <div className="flex flex-col border rounded-lg min-h-24 py-4 px-4 hover:border-blue-500">
      <Link href={`/course/${data.identifier}`}>
        <h1 className="text-xl font-bold">
          {data.course} - {data.title}
        </h1>
        <h1 className="text-gray-500/90 font-medium text-xl">{data.college}</h1>

        <hr className="my-2"></hr>

        <div className="flex gap-1 text-lg items-center">
          <p className="text-yellow-500">
            {data.avgRating ? data.avgRating.toFixed(1) : "N/A"}
          </p>
          <Rating
            defaultValue={data.avgRating}
            value={data.avgRating}
            precision={0.5}
            readOnly
            style={{ opacity: "90%" }}
          />
        </div>

        <h1 className="text-lg">
          Average:{" "}
          <span
            className={` ${
              data.avgGrade
                ? mapColor(mapGrade(data.avgGrade))
                : mapColor("N/A")
            }`}
          >
            {mapGrade(data.avgGrade)}
          </span>
        </h1>

        {data.units && data.price && (
          <h1 className="text-lg">
            {data.units} units - ${data.price}
          </h1>
        )}

        <h1 className="text-lg">
          Areas: <span className="text-blue-500">{data.areas.join(", ")}</span>
        </h1>
      </Link>
    </div>
  );
};

export default CoursesCard;
