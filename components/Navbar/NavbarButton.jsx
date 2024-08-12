import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const NavbarButton = ({ text = "Click Here", redirect = "/" }) => {
  const router = useRouter();
  const isActive = router.pathname === redirect;

  return (
    <Link href={redirect}>
      <button
        className={`${
          isActive ? "text-blue-600" : "text-gray-600"
        } font-medium hover:text-black hover:bg-gray-200 rounded-md py-1 px-3`}
      >
        {text}
      </button>
    </Link>
  );
};

export default NavbarButton;
