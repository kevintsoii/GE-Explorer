"use client";

import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import AreaGrid from "@/app/_components/Areas/AreaGrid";
import SearchBox from "@/app/_components/SearchBox";

const GET_AREAS = gql`
  query GetAreas {
    areas {
      area
      title
    }
  }
`;

const Areas = () => {
  const { loading, error, data } = useQuery(GET_AREAS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data?.areas.filter((area) =>
    area.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for GE Areas"
      />

      {loading && <Loader />}
      {error && <Error />}
      {data && filteredData.length == 0 && <div>No results found.</div>}
      {data && filteredData.length > 0 && <AreaGrid data={filteredData} />}
    </>
  );
};

export default Areas;
