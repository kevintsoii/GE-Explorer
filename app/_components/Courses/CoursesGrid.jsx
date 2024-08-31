import React from "react";

import CoursesCard from "./CoursesCard";

const CoursesGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {data.map((course) => (
        <CoursesCard key={course.identifier} data={course}></CoursesCard>
      ))}
    </div>
  );
};

export default CoursesGrid;
