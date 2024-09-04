"use client";

import React, { useState } from "react";
import moment from "moment";

import Select from "@/app/_components/Select";

const Sections = ({ college, sections }) => {
  const [sortOrder, setSortOrder] = useState("");

  const sortedSections = () => {
    const sorted = [...sections].filter(
      (item, index, self) => index === self.findIndex((t) => t.crn === item.crn)
    );

    switch (sortOrder) {
      case "Average Rating":
        return sorted.sort((a, b) => b.avgRating - a.avgRating);
      case "Average Grade":
        return sorted.sort((a, b) => b.avgGrade - a.avgGrade);
      case "Start Date":
        return sorted.sort((sectionA, sectionB) => {
          let dateA = moment(sectionA.date.split(" to ")[0], "MMM DD");
          let dateB = moment(sectionB.date.split(" to ")[0], "MMM DD");
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  };

  return (
    <>
      <Select
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        placeholder="Sort"
        options={["Average Rating", "Average Grade", "Start Date"]}
      />
      <div className="flex mt-3 mx-[-3%]">
        <div className="flex flex-col w-1/4 max-h-screen overflow-y-scroll gap-4">
          {sortedSections().map((section) => (
            <button
              key={section.crn}
              className="rounded-lg border border-gray-300 px-3 py-3 hover:cursor-pointer text-left"
            >
              <h2>{section.date}</h2>
              <p>{section.professor}</p>
              <p>{section.crn}</p>
              <p>{section.seats}</p>
              <p>{section.avgGrade}</p>
              <p>{section.avgRating}</p>
              <p>{section.seats_updated}</p>
            </button>
          ))}
        </div>

        <div className="flex w-3/4 bg-blue-200">s</div>
      </div>
    </>
  );
};

export default Sections;
