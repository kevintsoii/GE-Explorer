"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { mapPercentage, mapGrade, mapColor } from "../../_lib/util/map";
import { createGradeChart, createRatingChart } from "@/app/_lib/util/charts";

import Divider from "@/app/_components/Divider";
import { ChevronDown, ChevronUp } from "lucide-react";

const BookmarkCard = ({ info }) => {
  const gradeChartRef = useRef(null);
  const ratingChartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredGrades = info?.reviews
    ?.filter((review) => review.grade !== null && review.grade.length <= 2)
    .map((review) => review.grade[0]);

  const filteredRatings = info?.reviews
    ?.filter((review) => review.rating !== null)
    .map((review) => review.rating);

  useEffect(() => {
    createGradeChart(filteredGrades || [], gradeChartRef);
  }, [filteredGrades]);

  useEffect(() => {
    createRatingChart(filteredRatings || [], ratingChartRef);
  }, [filteredRatings]);

  return (
    <div className="flex mt-1 flex-col px-4 py-3 rounded-lg border border-gray-400">
      <div className="flex justify-between">
        <div>
          <Link
            href={`/course/${info.identifier}?college=${info.college}&name=${info.officialName}&crn=${info.crn}`}
          >
            <h1 className="font-semibold text-xl hover:underline">
              {info.class}
            </h1>
          </Link>
          <h2 className="text-gray-500 font-medium text-xl">
            {info.officialName}, {info.college}
          </h2>
        </div>
        <button
          className="flex self-start active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </button>
      </div>

      <Divider />

      <div className="flex gap-6 md:text-lg">
        {info.avgRating && (
          <div className="flex flex-col">
            <p>Rating</p>
            <p>{info.avgRating.toFixed(1)}</p>
          </div>
        )}
        {info.avgGrade && (
          <div className="flex flex-col">
            <p>Average</p>
            <p className={`${mapColor(mapGrade(info.avgGrade))}`}>
              {mapGrade(info.avgGrade)}
            </p>
          </div>
        )}
        {info.takeAgain && (
          <div className="flex flex-col">
            <p>Retake</p>
            <p className={`${mapPercentage(info.takeAgain)}`}>
              {info.takeAgain}%
            </p>
          </div>
        )}
        <div className="flex flex-col">
          <p>Areas</p>
          <p>{info.areas.join(", ")}</p>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="flex flex-col lg:flex-row lg:divide-x gap-6 divide-gray-300">
            <div className="flex flex-col px-2 items-center">
              <div
                className="flex mr-[4%] lg:mr-0 scale-[85%] lg:scale-100"
                ref={gradeChartRef}
              ></div>
              <h1 className="text-lg mt-2">Grade Distribution</h1>
            </div>
            <div className="flex flex-col px-2 items-center">
              <div
                className="flex mr-[4%] lg:mr-0 scale-[85%] lg:scale-100"
                ref={ratingChartRef}
              ></div>
              <h1 className="text-lg mt-2">Rating Distribution</h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookmarkCard;
