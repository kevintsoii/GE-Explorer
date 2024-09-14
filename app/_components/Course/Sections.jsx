"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { GET_PROFESSOR } from "@/app/_lib/apollo/queries";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import Select from "@/app/_components/Select";
import SectionCard from "@/app/_components/Course/SectionCard";
import Professor from "@/app/_components/Course/Professor";

const Sections = ({ college, sections }) => {
  const selectRef = useRef(null);
  const searchParams = useSearchParams();
  const [sortOrder, setSortOrder] = useState("");
  const [variables, setVariables] = useState({});
  const [getProfessor, { loading, error, data }] = useLazyQuery(GET_PROFESSOR, {
    variables,
  });

  useEffect(() => {
    if (searchParams.get("college") && searchParams.get("name")) {
      setVariables({
        college: searchParams.get("college"),
        name: searchParams.get("name"),
      });
      getProfessor();
      if (selectRef.current) {
        console.log("scrolling");
        selectRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

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
      <div ref={selectRef} className="pt-4 -mt-4">
        <Select
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          placeholder="Sort"
          options={["Average Rating", "Average Grade", "Start Date"]}
        />
      </div>

      <div className="flex mt-4 mx-[-2%]">
        <div className="custom-scroll flex flex-col w-1/4 max-h-[200vh] overflow-y-scroll gap-4 px-2">
          {sortedSections().map((section) => (
            <SectionCard
              key={section.crn}
              section={section}
              onClick={() => {
                setVariables({
                  college: college,
                  name: section.professor,
                });
                getProfessor();
                if (selectRef.current) {
                  selectRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          ))}
        </div>

        <div className="flex flex-col w-3/4 border-l border-gray-300 ml-2 pl-4">
          {loading && <Loader />}
          {error && <Error />}
          {data && <Professor data={data.professor} />}
        </div>
      </div>
    </>
  );
};

export default Sections;
