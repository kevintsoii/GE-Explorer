import React, { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { mapPercent, mapDifficulty } from "@/app/_lib/util/map";
import { createGradeChart, createRatingChart } from "@/app/_lib/util/charts";
import { useBookmarks } from "@/app/_lib/contexts/BookmarksContext";

import { Bookmark } from "lucide-react";

import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import Reviews from "./Reviews";

const inter = Inter({ subsets: ["latin"] });

const Professor = ({ data, identifier, refresh }) => {
  const gradeChartRef = useRef(null);
  const ratingChartRef = useRef(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const filteredGrades = data?.reviews
    .filter((review) => review.grade !== null && review.grade.length <= 2)
    .map((review) => review.grade[0]);

  const filteredRatings = data?.reviews
    .filter((review) => review.rating !== null)
    .map((review) => review.rating);

  useEffect(() => {
    createGradeChart(filteredGrades || [], gradeChartRef);
  }, [filteredGrades]);

  useEffect(() => {
    createRatingChart(filteredRatings || [], ratingChartRef);
  }, [filteredRatings]);

  const toggleBookmark = async () => {
    if (bookmarks?.includes(identifier)) {
      removeBookmark(identifier);
    } else {
      addBookmark(identifier);
    }
  };

  if (!data) return <h1>No previous data.</h1>;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-7 border-gray-300 border p-5 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 mb-3 lg:mb-0 justify-between">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <a
                href={`https://www.ratemyprofessors.com/professor/${data.id}`}
                target="_blank"
              >
                <h1 className="text-2xl xl:text-3xl font-medium hover:underline">
                  {data.name}
                </h1>
              </a>
              <div className="flex items-center gap-6 text-2xl">
                <p className="text-amber-500 text-2xl xl:text-3xl">
                  {data.avgRating ? data.avgRating?.toFixed(1) : "N/A"}
                </p>
                <div className="flex flex-col text-lg">
                  <Rating
                    value={data.avgRating}
                    defaultValue={data.avgRating}
                    precision={0.5}
                    readOnly
                    style={{ opacity: "90%" }}
                  />
                  <p>{data.reviews.length} reviews</p>
                </div>
              </div>
            </div>
            <button
              className="flex lg:hidden flex-col items-center self-start rounded-lg p-2 hover:bg-gray-100 text-blue-500 active:scale-[0.95]"
              onClick={toggleBookmark}
            >
              <Bookmark
                size={30}
                style={{
                  fill:
                    bookmarks && bookmarks.includes(identifier)
                      ? "currentColor"
                      : "",
                }}
              />
            </button>
          </div>

          <div className="flex gap-12">
            <div
              className={`flex flex-col items-center self-start rounded-lg p-3 ${mapPercent(
                data.takeAgain
              )}`}
            >
              <h1 className="text-2xl">{Math.round(data.takeAgain)}%</h1>
              <p>would retake</p>
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
            <button
              className="hidden lg:flex flex-col items-center self-start rounded-lg p-2 hover:bg-gray-100 text-blue-500 active:scale-[0.95]"
              onClick={toggleBookmark}
            >
              <Bookmark
                size={30}
                style={{
                  fill:
                    bookmarks && bookmarks.includes(identifier)
                      ? "currentColor"
                      : "",
                }}
              />
            </button>
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
                  className={`${inter.className} flex self-start text-xs`}
                />
              ))}
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row xl:divide-x gap-6 xl:gap-0 divide-gray-300 justify-between lg:mr-0 mr-[4%]">
        <div className="flex flex-col w-full lg:w-1/2 px-2 items-center">
          <h1 className="text-xl">Grade Distribution</h1>
          <div
            className="flex scale-[85%] lg:scale-100"
            ref={gradeChartRef}
          ></div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2 px-2 items-center">
          <h1 className="text-xl">Rating Distribution</h1>
          <div
            className="flex scale-[85%] lg:scale-100"
            ref={ratingChartRef}
          ></div>
        </div>
      </div>

      <Reviews
        reviews={data.reviews}
        professorInfo={{ id: data.id, name: data.name }}
        refresh={refresh}
      />
    </div>
  );
};

export default Professor;
