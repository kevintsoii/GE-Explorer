"use client";

import React from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useBookmarks } from "@/app/_lib/contexts/BookmarksContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/_lib/firebase/clientApp";

import Divider from "@/app/_components/Divider";

const SavedPage = () => {
  const { authUser, loading: authLoading } = useAuth();
  const { bookmarks } = useBookmarks();

  const router = useRouter();

  if (!authLoading && !authUser) {
    router.push("/");
    return null;
  }

  const handleGoogleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-4">
      <h1 className="text-3xl font-bold text-black mt-3">Bookmarks</h1>
      <p>{bookmarks}</p>
      {JSON.stringify(bookmarks)}
      <Divider />
      <button
        className="text-gray-500 underline self-start"
        onClick={handleGoogleLogout}
      >
        Sign Out
      </button>
    </main>
  );
};

export default SavedPage;
