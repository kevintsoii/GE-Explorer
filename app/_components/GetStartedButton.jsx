"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const GetStartedButton = ({ text = "Click Here", redirect = "/" }) => {
  const pathname = usePathname();
  const isActive = pathname === redirect;

  return (
    <Link href={redirect}>
      <button class="relative group overflow-hidden px-6 h-12 rounded-full flex space-x-2 items-center bg-gradient-to-r from-[#1335f9ec] to-[#a3c0fa] hover:to-[#89aefa]">
        <span class="relative text-sm text-white">Get Started</span>
        <div class="flex items-center -space-x-3 translate-x-3">
          <div class="w-2.5 h-[1.6px] rounded bg-white origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>
    </Link>
  );
};

export default GetStartedButton;
