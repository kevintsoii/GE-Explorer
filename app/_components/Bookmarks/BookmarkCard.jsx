"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mapPercentage, mapGrade, mapColor } from "../../_lib/util/map";

import Divider from "@/app/_components/Divider";
import { ChevronDown, ChevronUp } from "lucide-react";

const BookmarkCard = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

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
            <p>Average Rating</p>
            <p>{info.avgRating.toFixed(1)}</p>
          </div>
        )}
        {info.avgGrade && (
          <div className="flex flex-col">
            <p>Average Grade</p>
            <p className={`${mapColor(mapGrade(info.avgGrade))}`}>
              {mapGrade(info.avgGrade)}
            </p>
          </div>
        )}
        {info.takeAgain && (
          <div className="flex flex-col">
            <p>Would Retake</p>
            <p className={`${mapPercentage(info.takeAgain)}`}>
              {info.takeAgain}%
            </p>
          </div>
        )}
        <div className="flex flex-col">
          <p>Areas</p>
          <p className="text-blue-500">{info.areas.join(", ")}</p>
        </div>
      </div>

      {isOpen && <div></div>}
    </div>
  );
};

export default BookmarkCard;
