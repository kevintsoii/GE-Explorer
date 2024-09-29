"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/app/_lib/apollo/queries";

import { SquareArrowOutUpRight } from "lucide-react";

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
          <h2 className="text-2xl text-gray-500">{data.course.college}</h2>
          <p className="text-md">{data.course.description}</p>

          <div className="flex flex-col md:flex-row gap-x-20 gap-y-4 mt-2 text-lg md:rounded-lg md:bg-gray-200 md:self-start md:px-6 md:py-3">
            <div className="flex flex-col">
              <h3 className="text-blue-600">Price</h3>
              <p>${data.course.price}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-blue-600">Areas</h3>
              <p>{data.course.areas.join(", ")}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-blue-600">Units</h3>
              <p>{data.course.units}</p>
            </div>
          </div>

          <a
            className="flex mt-2 self-start"
            target="_blank"
            href={`https://search.cvc.edu/courses/${
              data.course.identifier.split(":")[1]
            }?filter[day_ids][]=1&filter[day_ids][]=2&filter[day_ids][]=3&filter[day_ids][]=4&filter[day_ids][]=5&filter[day_ids][]=6&filter[day_ids][]=7&filter[delivery_method_subtypes][]=online_async&filter[delivery_methods][]=online&filter[oei_phase_2_filter]=false&filter[prerequisites][]=&filter[prerequisites][]=no_prereqs&filter[residency_id]=5&filter[search_all_universities]=true&filter[search_type]=subject_browsing&filter[session_names][]=Fall+2024&filter[show_only_available]=false&filter[show_self_paced]=true&filter[show_untimed]=true&filter[sort]=oei&filter[subject_id]=${
              data.course.identifier.split(":")[0]
            }&filter[transferability][]=articulation`}
          >
            <button className="flex items-center gap-2 border-blue-500 border px-4 py-3 rounded-lg hover:border-black">
              View on CVC
              <SquareArrowOutUpRight size={15} />
            </button>
          </a>

          <Divider />

          {data.course.sections.length === 0 && <h2>No sections found.</h2>}
          {data.course.sections.length > 0 && (
            <Sections
              college={data.course.college}
              sections={data.course.sections}
              identifier={data.course.identifier}
            />
          )}
        </>
      )}
    </>
  );
};

export default Course;
