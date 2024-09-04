import React from "react";
import { Inter } from "next/font/google";

import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { ChevronRight } from "lucide-react";

import Course from "@/app/_components/Course/Course";

const inter = Inter({ subsets: ["latin"] });

const CoursePage = ({ params }) => {
  const { identifier } = params;

  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-4">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<ChevronRight className="text-gray-600" />}
        className={`text-md ${inter.className}`}
      >
        <Link
          href="/"
          className="no-underline underline-offset-2 hover:underline"
        >
          Home
        </Link>
        <Link
          href="/courses"
          className="no-underline underline-offset-2 hover:underline"
        >
          Courses
        </Link>
        <p className="text-black select-none">Course</p>
      </Breadcrumbs>

      <Course identifier={identifier} />
    </main>
  );
};

export default CoursePage;
