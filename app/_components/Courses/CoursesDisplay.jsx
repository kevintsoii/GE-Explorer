"use client";

import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_COURSES } from "@/app/_lib/apollo/queries";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import CoursesGrid from "./CoursesGrid";

const CoursesDisplay = ({ variables, setHistory }) => {
  const [
    getCourses,
    { loading: coursesLoading, error: couresError, data: coursesData },
  ] = useLazyQuery(GET_COURSES);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getCourses({ variables });
      if (data?.courses.pageInfo.hasNextPage) {
        setHistory(
          (history) => new Set([...history, data?.courses.pageInfo.endCursor])
        );
      }
    }
    fetchData();
  }, [variables]);

  return (
    <div className="mt-3">
      {coursesLoading && <Loader />}
      {couresError && <Error />}
      {coursesData && <CoursesGrid data={coursesData.courses.edges} />}
    </div>
  );
};

export default CoursesDisplay;
