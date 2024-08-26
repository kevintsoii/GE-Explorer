import React from "react";
import Courses from "@/app/_components/Courses/Courses";

const CoursesPage = () => {
  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-6">
      <h1 className="self-start mt-3 font-bold text-3xl">Courses</h1>
      <p className="text-lg">
        Many courses are available to help you transfer to a CSU.
      </p>

      <Courses />
    </main>
  );
};

export default CoursesPage;
