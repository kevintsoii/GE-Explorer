import React from "react";

import Divider from "@/app/_components/Divider";
import Courses from "@/app/_components/Courses/Courses";

const CoursesPage = () => {
  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-4">
      <h1 className="self-start mt-3 font-bold text-3xl">
        Courses - Winter 2024
      </h1>
      <p className="text-lg">
        Verify transferability through{" "}
        <a
          href="https://assist.org/"
          target="_blank"
          className="underline text-blue-600 hover:text-blue-800"
        >
          assist.org
        </a>
        .
      </p>

      <Divider />

      <Courses />
    </main>
  );
};

export default CoursesPage;
