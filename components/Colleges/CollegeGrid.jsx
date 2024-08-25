import React from "react";

import CollegeCard from "./CollegeCard";

const CollegeGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {data.map((college) => (
        <CollegeCard
          key={college.college}
          college={college.college}
          rating={college.avgRating}
          ratings={college.ratings}
        ></CollegeCard>
      ))}
    </div>
  );
};

export default CollegeGrid;
