import React from "react";

import Areas from "@/app/_components/Areas/Areas";
import Divider from "@/app/_components/Divider";

const AreasPage = () => {
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

      <Areas />
    </main>
  );
};

export default AreasPage;
