import React from "react";

import Divider from "@/app/_components/Divider";
import Colleges from "@/app/_components/Colleges/Colleges";

const CollegesPage = () => {
  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-6">
      <h1 className="self-start mt-3 font-bold text-3xl">Community Colleges</h1>
      <p className="text-lg">
        Many CCs have courses that are transferrable to CSU. View some popular
        options below.
      </p>

      <Divider />

      <Colleges />
    </main>
  );
};

export default CollegesPage;
