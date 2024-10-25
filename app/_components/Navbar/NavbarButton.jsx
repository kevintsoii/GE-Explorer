"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const NavbarButton = ({ text = "Click Here", redirect = "/" }) => {
  const pathname = usePathname();
  const isActive = pathname === redirect;

  return (
    <Link href={redirect}>
      <button
        className={`${
          isActive ? "text-blue-600" : "text-gray-600 hover:text-black"
        } font-medium hover:bg-gray-200 rounded-md py-1 px-3`}
      >
        {text}
      </button>
    </Link>
  );
};

export default NavbarButton;
