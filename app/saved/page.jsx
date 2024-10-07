"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useBookmarks } from "@/app/_lib/contexts/BookmarksContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useLazyQuery } from "@apollo/client";
import { auth } from "@/app/_lib/firebase/clientApp";
import { GET_BOOKMARK_INFO } from "@/app/_lib/apollo/queries";

import Divider from "@/app/_components/Divider";
import Loader from "@/app/_components/Loader";
import BookmarkCard from "@/app/_components/Bookmarks/BookmarkCard";

const SavedPage = () => {
  const { authUser, loading: authLoading } = useAuth();
  const { loading, bookmarks } = useBookmarks();
  const [getBookmarkInfo, { loading: infoLoading, error, data }] =
    useLazyQuery(GET_BOOKMARK_INFO);

  const router = useRouter();

  useEffect(() => {
    const fetchBookmarkInfo = async () => {
      if (authUser && !loading && bookmarks.length !== 0) {
        try {
          const token = await authUser.token();
          getBookmarkInfo({
            context: {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          });
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    fetchBookmarkInfo();
  }, [authUser, loading]);

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
      {(loading || authLoading || infoLoading) && <Loader />}
      {!loading && bookmarks.length === 0 && <p>No bookmarks saved.</p>}
      {data &&
        Object.keys(data).length !== 0 &&
        data.bookmarkInfo.map((bookmark) => {
          return <BookmarkCard key={bookmark.id} info={bookmark} />;
        })}
      <Divider />
      <p className="text-gray-500">Maximum of 20 bookmarks allowed.</p>
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
