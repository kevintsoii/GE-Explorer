"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_AREAS } from "@/app/_lib/apollo/queries";

import Loader from "@/app/_components/Loader";
import Error from "@/app/_components/Error";
import AreaGrid from "@/app/_components/Areas/AreaGrid";
import SearchBox from "@/app/_components/SearchBox";

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
