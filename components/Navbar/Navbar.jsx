import React from "react";
import Link from "next/link";

import { Globe } from "lucide-react";

import NavbarButton from "./NavbarButton";

const Navbar = () => {
  return (
    <nav className="absolute flex w-full h-20 items-center justify-between sm:px-8 md:px-16 lg:px-32">
      <Link href="/">
        <h1 className="font-semibold flex gap-1 text-xl items-center">
          <Globe className="text-blue-600" size={30} strokeWidth={1.5} />
          GE <span className="text-blue-600">Explorer</span>
        </h1>
      </Link>
      <div className="flex items-center">
        <ul className="flex gap-3 items-center">
          <NavbarButton text="Areas" redirect="/areas" />
          <NavbarButton text="Colleges" redirect="/colleges" />
          <NavbarButton text="Courses" redirect="/courses" />
        </ul>
        <div className="h-8 divider border-l border-gray-300 mx-3"></div>
        <button className="px-3 py-1 rounded-lg hover:bg-gray-300">
          (Sign In)
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
