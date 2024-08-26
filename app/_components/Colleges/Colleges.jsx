"use client";

import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import SearchBox from "@/app/_components/SearchBox";
import Select from "@/app/_components/Select";
import CollegeGrid from "./CollegeGrid";

const GET_COLLEGES = gql`
  query GetColleges {
    colleges {
      avgRating
      college
      ratings
    }
  }
`;

const Colleges = () => {
  const { loading, error, data } = useQuery(GET_COLLEGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const filteredData = data?.colleges.filter((college) =>
    college.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData =
    sortOrder === "Rating"
      ? filteredData.sort((a, b) => b.avgRating - a.avgRating)
      : filteredData;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for Community Colleges"
        />
        <Select
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          placeholder="Sort"
          options={["Alphabetical", "Rating"]}
        ></Select>
      </div>

      {loading && <Loader />}
      {error && <Error />}
      {data && sortedData.length == 0 && <div>No results found.</div>}
      {data && sortedData.length > 0 && <CollegeGrid data={filteredData} />}
    </>
  );
};

export default Colleges;
