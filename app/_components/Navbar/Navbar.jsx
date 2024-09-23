"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/_lib/firebase/AuthContext";

import { Globe, Menu, X } from "lucide-react";
import LoginButton from "./LoginButton";
import NavbarButton from "./NavbarButton";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { authUser, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute flex w-full h-20 px-4 sm:px-8 md:px-16 lg:px-32 overflow-x-hidden">
      <div className="hidden sm:flex w-full justify-between items-center">
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
          {authUser ? (
            <NavbarButton text="Saved" redirect="/saved" />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>

      <div className="flex sm:hidden w-full justify-between items-center">
        <Link href="/">
          <h1 className="font-semibold flex gap-1 text-xl items-center">
            <Globe className="text-blue-600" size={30} strokeWidth={1.5} />
            GE <span className="text-blue-600">Explorer</span>
          </h1>
        </Link>
        <button
          className="rounded-xl px-2 py-2 active:bg-gray-200"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={25} strokeWidth={1.5} />
        </button>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          authUser={authUser}
        />
      </div>
    </nav>
  );
};

export default Navbar;
