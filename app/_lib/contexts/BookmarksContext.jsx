import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useLazyQuery } from "@apollo/client";
import { GET_BOOKMARKS } from "@/app/_lib/apollo/queries";

const BookmarksContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  return context;
};

export const BookmarksProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const { authUser, loading: authLoading } = useAuth();
  const [getBookmarks, { loading, error, data }] = useLazyQuery(GET_BOOKMARKS);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (authLoading || !authUser) {
        setBookmarks([]);
        return;
      }

      try {
        console.log(authUser);
        await getBookmarks({
          context: {
            headers: {
              authorization: `Bearer ${authUser.token}`,
            },
          },
        });
        setBookmarks(data.bookmarks);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchBookmarks();
  }, [authUser, authLoading]);

  return (
    <BookmarksContext.Provider value={{ bookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};
