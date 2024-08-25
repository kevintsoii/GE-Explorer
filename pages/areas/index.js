import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Divider from "@/components/Divider";
import AreaGrid from "@/components/Areas/AreaGrid";
import SearchBox from "@/components/SearchBox";

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
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-6">
      <h1 className="self-start mt-3 font-bold text-3xl">GE Areas</h1>
      <p className="text-lg">
        All CSU students are required to take General Education courses in
        addition to their major program (
        <a
          href="https://www.calstate.edu/csu-system/administration/academic-and-student-affairs/academic-programs-innovations-and-faculty-development/faculty-development-and-innovative-pedagogy/Pages/general-education-policy.aspx"
          target="_blank"
          className="underline text-blue-600 hover:text-blue-800"
        >
          calstate.edu
        </a>
        ).
      </p>

      <Divider />

      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for GE Areas"
      />

      {loading && <Loader />}
      {error && <Error />}
      {data && filteredData.length == 0 && <div>No results found.</div>}
      {data && filteredData.length > 0 && <AreaGrid data={filteredData} />}
    </main>
  );
};

export default Areas;
