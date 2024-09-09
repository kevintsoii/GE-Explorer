import React from "react";
import { Inter } from "next/font/google";
import { mapPercent, mapDifficulty } from "@/app/_lib/util/map";

import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import Reviews from "./Reviews";

const inter = Inter({ subsets: ["latin"] });

const Professor = ({ data }) => {
  if (!data) return <h1>No previous data.</h1>;

  const filteredGrades = data.reviews
    .filter((review) => review.grade !== null && review.grade.length <= 2)
    .map((review) => review.grade[0]);

  const filteredRatings = data.reviews
    .filter((review) => review.rating !== null)
    .map((review) => review.rating);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-7 border-gray-300 border p-5 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <a
              href={`https://www.ratemyprofessors.com/professor/${data.id}`}
              target="_blank"
            >
              <h1 className="text-4xl font-medium hover:underline">
                {data.name}
              </h1>
            </a>

            <div className="flex items-center gap-6 text-3xl">
              <p className="text-amber-500">
                {data.avgRating ? data.avgRating?.toFixed(1) : "N/A"}
              </p>

              <div className="flex flex-col text-lg">
                <Rating
                  defaultValue={data.avgRating}
                  precision={0.5}
                  readOnly
                  style={{ opacity: "90%" }}
                />
                <p>{data.reviews.length} reviews</p>
              </div>
            </div>
          </div>

          <div className="flex gap-12 mr-12">
            <div
              className={`flex flex-col items-center self-start rounded-lg p-3 ${mapPercent(
                data.takeAgain
              )}`}
            >
              <h1 className="text-2xl">{Math.round(data.takeAgain)}%</h1>
              <p>would take again</p>
            </div>
            <div
              className={`flex flex-col items-center self-start rounded-lg p-3 ${mapDifficulty(
                data.avgDifficulty
              )}`}
            >
              <h1 className="text-gray-500">
                <span className="text-2xl text-black">
                  {data.avgDifficulty}
                </span>
                /5.0
              </h1>
              <p>difficulty level</p>
            </div>
          </div>
        </div>

        {data.tags && (
          <div className="flex gap-50 flex-wrap mt-3 gap-x-3 gap-y-2">
            {Object.entries(data.tags)
              .filter(([key]) => key !== "")
              .map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key} (${value})`}
                  className={`${inter.className} flex self-start`}
                />
              ))}
          </div>
        )}
      </div>

      <div className="flex divide-x-2 divide-gray-300 justify-between">
        <div className="flex w-1/2">{filteredGrades}{data.avgRating}</div>
        <div className="flex w-1/2">{filteredRatings}{data.avgGrade}</div>
      </div>

      <Reviews reviews={data.reviews} />
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default Professor;
