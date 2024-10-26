import React, { useState } from "react";
import { mapColor } from "@/app/_lib/util/map";
import { useReviews } from "@/app/_lib/contexts/ReviewsContext";
import { useAuth } from "@/app/_lib/firebase/AuthContext";

import Rating from "@mui/material/Rating";
import Divider from "@/app/_components/Divider";
import Modal from "./ReviewModal";
import Tooltip from "@mui/material/Tooltip";
import { MessageCirclePlus, Pencil, Trash2 } from "lucide-react";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  if (year !== currentYear) {
    return `${formattedDate}, ${year}`;
  }

  return formattedDate;
};

const Reviews = ({ reviews, professorInfo, refresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPresets, setModalPresets] = useState({});
  const { reviews: userReviews, removeReview } = useReviews();
  const { authUser, loading } = useAuth();

  const reviewsSorted = reviews?.slice().sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <Divider />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        professorInfo={professorInfo}
        refresh={refresh}
        presets={modalPresets}
      />

      <div className="gap-3 flex justify-between">
        <h1 className="text-xl my-3">Reviews ({reviews.length})</h1>
        <div className="flex items-center">
          <Tooltip title="Leave a Review" placement="top">
            <button
              disabled={!authUser}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <MessageCirclePlus
                className="text-blue-500 mb-2 active:scale-95"
                size={24}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="custom-scroll max-h-[200vh] overflow-y-scroll grid lg:grid-cols-2 gap-4 pr-2">
        {reviewsSorted.map((review, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border border-gray-300 p-3 rounded-lg bg-gray-100"
          >
            <div className="text-lg flex justify-between">
              <div className="flex flex-col gap-px">
                <h1>{review.class}</h1>
                <Rating
                  value={review.rating}
                  defaultValue={review.rating}
                  precision={0.5}
                  readOnly
                  style={{ opacity: "90%" }}
                />
              </div>
              <div className="text-right">
                <h2 className="text-gray-400">
                  {formatTimestamp(review.date)}
                </h2>{" "}
                {review.grade && (
                  <p>
                    <span className={`${mapColor(review.grade)}`}>
                      {review.grade}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <hr></hr>
            <p>{review.comment}</p>
            {userReviews.includes(review.id) && (
              <>
                <div className="flex self-end gap-3">
                  <button
                    onClick={() => {
                      setModalPresets({ ...review });
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="ative:scale-[0.95]" />
                  </button>
                  <button
                    onClick={async () => {
                      await removeReview(review.id);
                      refresh({ fetchPolicy: "network-only" });
                    }}
                  >
                    <Trash2 className="text-red-500 active:scale-[0.95]" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Reviews;
