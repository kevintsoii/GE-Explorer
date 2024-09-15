"use client";

import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/_lib/firebase/clientApp";

const LoginButton = ({ isMobile = false }) => {
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider);
  };

  return (
    <button
      className={`${
        isMobile
          ? "text-gray-600 hover:text-black flex w-full font-medium rounded-md py-1"
          : "px-3 py-2 font-medium rounded-lg text-white bg-blue-500 ml-2 active:scale-[0.98]"
      }`}
      onClick={handleGoogleLogin}
    >
      Sign In
    </button>
  );
};

export default LoginButton;
