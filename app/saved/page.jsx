"use client";

import React from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useRouter } from "next/navigation";

const SavedPage = () => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  if (!authUser && !loading) {
    router.push("/");
    return null;
  }

  return <div>{loading ? <p>Loading...</p> : <div>page</div>}</div>;
};

export default SavedPage;
