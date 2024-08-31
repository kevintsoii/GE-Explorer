"use client";

import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_COURSES } from "@/app/_lib/apollo/queries";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import CoursesGrid from "./CoursesGrid";

const CoursesDisplay = ({ variables }) => {
  const [cursor, setCursor] = useState(null);
  const [history, setHistory] = useState([]);

  const [
    getCourses,
    { loading: coursesLoading, error: couresError, data: coursesData },
  ] = useLazyQuery(GET_COURSES);

  useEffect(() => {
    getCourses({ variables });
  }, [getCourses, variables]);

  return (
    <div className="mt-3">
      {coursesLoading && <Loader />}
      {couresError && <Error />}
      {coursesData && <CoursesGrid data={coursesData.courses.edges} />}
    </div>
  );
};

export default CoursesDisplay;
