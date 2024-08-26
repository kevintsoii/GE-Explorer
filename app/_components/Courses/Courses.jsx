"use client";

import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";

const GET_COURSES = gql`
  query GetCourses {
    courses {
      identifier
      college
      course
      description
      price
      units
      title
      avgRating
      sectionCount
    }
  }
`;

const Courses = () => {
  const [getCourses, { loading, error, data }] = useLazyQuery(GET_COURSES);

  return (
    <main className="flex min-h-screen flex-col items-center py-20 max-w-full">
      <div className="">asdad</div>
      {loading && <Loader />}
      {error && <Error />}
      {data && <div>{JSON.stringify(data)}</div>}
      <button onClick={() => getCourses()}>Get Courses</button>
    </main>
  );
};

export default Courses;
