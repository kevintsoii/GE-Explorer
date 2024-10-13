import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/_lib/firebase/AuthContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_USER_REVIEWS,
  ADD_REVIEW,
  REMOVE_REVIEW,
} from "@/app/_lib/apollo/queries";

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { authUser, loading: authLoading } = useAuth();

  const [getReviews, { _, error, data }] = useLazyQuery(GET_USER_REVIEWS);
  const [addReviewMutation] = useMutation(ADD_REVIEW);
  const [removeReviewMutation] = useMutation(REMOVE_REVIEW);

  useEffect(() => {
    const fetchReviews = async () => {
      if (authLoading) {
        return;
      }
      if (!authUser) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await getReviews({
          context: {
            headers: {
              authorization: `Bearer ${await authUser.token()}`,
            },
          },
        });
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [authUser, authLoading]);

  const addReview = async (variables) => {
    try {
      const { data } = await addReviewMutation({
        variables,
        context: {
          headers: {
            authorization: `Bearer ${await authUser.token()}`,
          },
        },
      });

      if (data.errors) {
        return data.errors[0].message;
      }
      setReviews((previousReviews) => {
        const updatedReviews = new Set([...previousReviews, data.addReview.id]);
        return Array.from(updatedReviews);
      });
      return null;
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const removeReview = async (id) => {
    if (!reviews?.includes(id)) return;

    try {
      const { data } = await removeReviewMutation({
        variables: { id },
        context: {
          headers: {
            authorization: `Bearer ${await authUser.token()}`,
          },
        },
      });

      if (data.errors) {
        return data.errors[0].message;
      }
      setReviews((previousReviews) => {
        return previousReviews.filter((b) => b !== id);
      });
      return null;
    } catch (error) {
      console.error("Error removing review:", error);
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, removeReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};
