import React from "react";

import { mapGrade, mapColor } from "../../_lib/util/map";

const SectionCard = ({ section, onClick }) => {
  return (
    <button
      className="rounded-lg border border-gray-300 px-3 py-3 hover:cursor-pointer hover:border-blue-500 text-left active:scale-[98%]"
      onClick={onClick}
    >
      <p className="text-lg font-medium">{section.date}</p>
      <p className="text-lg text-gray-500">Professor {section.professor}</p>

      <div className="text-lg flex gap-1">
        <span
          className={` ${
            section.avgGrade
              ? mapColor(mapGrade(section.avgGrade))
              : mapColor("N/A")
          }`}
        >
          {mapGrade(section.avgGrade)}
        </span>
        <p className="text-gray-400/80">•</p>
        <p className="text-yellow-500">
          {section.avgRating ? section.avgRating.toFixed(1) + "/5" : "N/A"}
        </p>
      </div>

      <p>
        {section.seats} seats ({section.seats_updated})
      </p>
    </button>
  );
};

export default SectionCard;
