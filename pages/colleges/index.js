import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Divider from "@/components/Divider";
import SearchBox from "@/components/SearchBox";
import Select from "@/components/Select";
import CollegeGrid from "@/components/Colleges/CollegeGrid";

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
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-6">
      <h1 className="self-start mt-3 font-bold text-3xl">Community Colleges</h1>
      <p className="text-lg">
        Many CCs have courses that are transferrable to CSU. View some popular
        options below.
      </p>

      <Divider />

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
    </main>
  );
};

export default Colleges;
