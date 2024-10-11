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
import Modal from "@/app/_components/Modal";

const Sections = ({ college, sections, identifier }) => {
  const selectRef = useRef(null);

  const searchParams = useSearchParams();
  const [sortOrder, setSortOrder] = useState("");
  const [variables, setVariables] = useState({});
  const [modalActive, setModalActive] = useState(false);
  const [getProfessor, { loading, error, data }] = useLazyQuery(GET_PROFESSOR, {
    variables,
  });

  useEffect(() => {
    if (
      searchParams.get("college") &&
      searchParams.get("name") &&
      searchParams.get("crn")
    ) {
      setVariables({
        college: searchParams.get("college"),
        name: searchParams.get("name"),
        crn: searchParams.get("crn"),
      });
      getProfessor();
      if (selectRef.current) {
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

      <div className="flex mt-4 xl:mx-[-2%] lg:mx-[-10%]">
        <div className="hidden lg:flex custom-scroll flex flex-col lg:w-1/4 max-h-[200vh] overflow-y-scroll gap-4 px-2">
          {sortedSections().map((section) => (
            <SectionCard
              key={section.crn}
              section={section}
              onClick={() => {
                setVariables({
                  college: college,
                  name: section.professor,
                  crn: section.crn,
                });
                if (selectRef.current) {
                  selectRef.current.scrollIntoView({ behavior: "smooth" });
                }
                getProfessor();
              }}
            />
          ))}
        </div>
        <div className="lg:hidden flex flex-col gap-4 w-full">
          {sortedSections().map((section) => (
            <>
              <SectionCard
                key={section.crn}
                section={section}
                onClick={(event) => {
                  setVariables({
                    college: college,
                    name: section.professor,
                    crn: section.crn,
                  });
                  getProfessor();

                  setModalActive(true);
                }}
              />
            </>
          ))}
        </div>
        <Modal isOpen={modalActive} onClose={() => setModalActive(false)}>
          {data && (
            <Professor
              data={data.professor}
              identifier={`${identifier}|${variables.crn}`}
            />
          )}
        </Modal>

        <div className="hidden lg:flex flex-col lg:w-3/4 border-l border-gray-300 ml-2 pl-4">
          {loading && <Loader />}
          {error && <Error />}
          {data && (
            <Professor
              data={data.professor}
              identifier={`${identifier}|${variables.crn}`}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Sections;
