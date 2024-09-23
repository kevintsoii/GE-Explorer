"use client";

import React from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useRouter } from "next/navigation";

import Loader from "@/app/_components/Loader";

const SavedPage = () => {
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  if (!authLoading && !authUser) {
    router.push("/");
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col py-20 px-4 sm:px-8 md:px-16 lg:px-32 gap-4">
      {authLoading ? (
        <Loader />
      ) : (
        <div className="flex-col gap-6">
          <h1 className="text-3xl font-bold text-black mt-3">Bookmarks</h1>
        </div>
      )}
    </main>
  );
};

export default SavedPage;
