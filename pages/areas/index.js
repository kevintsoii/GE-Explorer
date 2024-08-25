import React, { useState } from "react";
import { Search } from "lucide-react";
import { gql, useQuery } from "@apollo/client";

import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Divider from "@/components/Divider";
import AreaCard from "@/components/Areas/AreaCard";
import AreaGrid from "@/components/Areas/AreaGrid";

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
      <h1 className="self-start mt-6 font-bold text-3xl">GE Areas</h1>
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

      <label className="flex self-start items-center gap-2 border border-gray-400 rounded-lg px-4 py-2.5 focus-within:border-blue-500 justify-between w-full md:w-[400px]">
        <input
          type="text"
          placeholder="Search for GE Areas"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="focus:outline-none"
        ></input>
        <Search strokeWidth={1.5} size={22} className="text-blue-500" />
      </label>

      {loading && <Loader />}
      {error && <Error />}
      {data && filteredData.length == 0 && <div>No results found.</div>}
      {data && filteredData.length > 0 && <AreaGrid data={filteredData} />}
    </main>
  );
};

export default Areas;
