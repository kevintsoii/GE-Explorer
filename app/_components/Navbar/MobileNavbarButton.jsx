"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const MobileNavbarButton = ({
  text = "Click Here",
  redirect = "/",
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === redirect;

  return (
    <Link href={redirect}>
      <button
        onClick={onClick}
        className={`${
          isActive ? "text-blue-600" : "text-gray-600 hover:text-black"
        } flex w-full font-medium rounded-md py-1`}
      >
        {text}
      </button>
    </Link>
  );
};

export default MobileNavbarButton;
