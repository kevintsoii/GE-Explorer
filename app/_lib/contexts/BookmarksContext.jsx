import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_BOOKMARKS,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
} from "@/app/_lib/apollo/queries";

const BookmarksContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  return context;
};

export const BookmarksProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const { authUser, loading: authLoading } = useAuth();

  const [getBookmarks, { _, error, data }] = useLazyQuery(GET_BOOKMARKS);
  const [addBookmarkMutation] = useMutation(ADD_BOOKMARK);
  const [removeBookmarkMutation] = useMutation(REMOVE_BOOKMARK);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (authLoading) {
        return;
      }
      if (!authUser) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await getBookmarks({
          context: {
            headers: {
              authorization: `Bearer ${await authUser.token()}`,
            },
          },
        });
        setBookmarks(data.bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setBookmarks([]);
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, [authUser, authLoading]);

  const addBookmark = async (id) => {
    if (bookmarks?.includes(id)) return;

    try {
      const { data } = await addBookmarkMutation({
        variables: { id },
        context: {
          headers: {
            authorization: `Bearer ${await authUser.token()}`,
          },
        },
      });

      if (data.addBookmark) {
        setBookmarks((previousBookmarks) => {
          const updatedBookmarks = new Set([...previousBookmarks, id]);
          const bookmarksArray = Array.from(updatedBookmarks);
          if (bookmarksArray.length > 20) {
            return bookmarksArray.slice(-20);
          }
          return bookmarksArray;
        });
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async (id) => {
    if (!bookmarks?.includes(id)) return;

    try {
      const { data } = await removeBookmarkMutation({
        variables: { id },
        context: {
          headers: {
            authorization: `Bearer ${await authUser.token()}`,
          },
        },
      });

      if (data.removeBookmark) {
        setBookmarks((previousBookmarks) => {
          return previousBookmarks.filter((b) => b !== id);
        });
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{ loading, bookmarks, addBookmark, removeBookmark }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};
