"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/app/_lib/apollo/queries";

import Divider from "@/app/_components/Divider";
import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import Sections from "@/app/_components/Course/Sections";

const Course = ({ identifier }) => {
  const { loading, error, data } = useQuery(GET_COURSE, {
    variables: { identifier: identifier },
  });

  return (
    <>
      {loading && <Loader />}
      {error && <Error />}
      {data && !data.course && (
        <h1 className="mt-4 text-3xl">Course not found.</h1>
      )}
      {data && data.course && (
        <>
          <h1 className="self-start mt-3 font-bold text-3xl">
            {data.course.course} - {data.course.title}
          </h1>
          <h2 className="text-2xl">{data.course.college}</h2>
          <p className="text-md">{data.course.description}</p>
          <div className="flex flex-col md:flex-row gap-x-20 gap-y-4 text-lg md:rounded-lg md:bg-gray-200 md:self-start md:px-6 md:py-3">
            <div className="flex flex-col">
              <h3 className="text-blue-600">Price</h3>
              <p>${data.course.price}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-blue-600">Units</h3>
              <p>{data.course.units}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-blue-600">Areas</h3>
              <p>{data.course.areas.join(", ")}</p>
            </div>
          </div>

          <Divider />

          {data.course.sections.length === 0 && <h2>No sections found.</h2>}
          {data.course.sections.length > 0 && (
            <Sections
              college={data.course.college}
              sections={data.course.sections}
            />
          )}
        </>
      )}
    </>
  );
};

export default Course;
