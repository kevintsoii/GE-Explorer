"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { Search } from "lucide-react";

import { GET_AREA_NAMES, GET_COLLEGE_NAMES } from "@/app/_lib/apollo/queries";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import SearchBox from "@/app/_components/SearchBox";
import MultiSelect from "@/app/_components/MultiSelect";
import CoursesDisplay from "@/app/_components/Courses/CoursesDisplay";

import { ArrowLeft, ArrowRight } from "lucide-react";

const Courses = () => {
  const {
    loading: areaLoading,
    error: areaError,
    data: areaData,
  } = useQuery(GET_AREA_NAMES);
  const {
    loading: collegeLoading,
    error: collegeError,
    data: collegeData,
  } = useQuery(GET_COLLEGE_NAMES);

  const [variables, setVariables] = useState({
    searchTerm: "",
    colleges: [],
    areas: [],
    cursor: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorHistory, setCursorHistory] = useState(new Set([""]));

  const onSubmit = (e) => {
    e.preventDefault();
    setCursorHistory(new Set([""]));
    setCursorIndex(0);
    setVariables({
      searchTerm: searchQuery,
      colleges: selectedColleges,
      areas: selectedAreas,
      cursor: "",
    });
  };

  const onPageChange = (e, offset) => {
    e.preventDefault();
    setCursorIndex((index) => {
      setVariables({
        searchTerm: searchQuery,
        colleges: selectedColleges,
        areas: selectedAreas,
        cursor: [...cursorHistory][index + offset] || "",
      });
      return index + offset;
    });
  };

  return (
    <>
      {(areaLoading || collegeLoading) && <Loader />}
      {(areaError || collegeError) && <Error />}

      {areaData && collegeData && (
        <>
          <form
            className="flex flex-col gap-4"
            onSubmit={onSubmit}
            autoComplete="off"
          >
            <div className="flex flex-col xl:flex-row gap-4">
              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search for Keywords"
              />
              <MultiSelect
                placeholder="Filter for Areas"
                options={areaData.areas.map((area) => area.area)}
                setSelected={setSelectedAreas}
              />
              <MultiSelect
                placeholder="Filter for Colleges"
                options={collegeData.colleges.map((college) => college.college)}
                setSelected={setSelectedColleges}
              />
            </div>

            <button
              type="submit"
              className="flex gap-3 self-start bg-blue-500/20 px-3 py-2.5 rounded-lg hover:border-gray-600 border border-gray-400 active:scale-95"
              disabled={areaLoading || collegeLoading}
            >
              <Search />
              Apply Search Filters
            </button>

            <div className="flex gap-3 mt-2 text-lg items-center">
              <button
                className="disabled:text-gray-400"
                disabled={cursorIndex - 1 < 0}
                onClick={(e) => onPageChange(e, -1)}
              >
                <ArrowLeft />
              </button>
              Page {cursorIndex + 1}
              <button
                className="disabled:text-gray-400"
                disabled={cursorIndex + 1 >= cursorHistory.size}
                onClick={(e) => onPageChange(e, 1)}
              >
                <ArrowRight />
              </button>
            </div>
          </form>

          <CoursesDisplay variables={variables} setHistory={setCursorHistory} />
        </>
      )}
    </>
  );
};

export default Courses;
