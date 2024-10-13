import React, { useState, useEffect, useRef } from "react";
import { useReviews } from "@/app/_lib/contexts/ReviewsContext";

import Rating from "@mui/material/Rating";
import Divider from "@/app/_components/Divider";
import Select from "./GradeSelect";
import MultiSelect from "./TagSelect";

const Modal = ({ isOpen, onClose, professorInfo, refresh, presets }) => {
  const { reviews: userReviews, addReview, removeReview } = useReviews();

  const [className, setClassName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [comment, setComment] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [rating, setRating] = useState(1);
  const [tags, setTags] = useState([]);
  const [grade, setGrade] = useState("A");
  const [takeAgain, setTakeAgain] = useState(false);

  useEffect(() => {
    if (isOpen && presets) {
      const classNameMatch = presets.class?.match(/^[^\d]+/);
      const classNumberMatch = presets.class?.match(/\d.*/);

      setClassName(classNameMatch ? classNameMatch[0].trim() : "");
      setClassNumber(classNumberMatch ? classNumberMatch[0].trim() : "");
      setComment(presets.comment || "");
      setDifficulty(presets.difficulty || 1);
      setRating(presets.rating || 1);
      setTags(presets.tags?.map((tag) => ({ value: tag, label: tag })) || []);
      setGrade(presets.grade || "A");
      setTakeAgain(presets.takeAgain || false);
    }
  }, [isOpen, presets]);

  const [error, setError] = useState("");
  const errorRef = useRef(null);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showError = (message) => {
    setError(message);
    errorRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!className || !classNumber) {
      showError("Please enter a class name and number.");
      return;
    }
    if (!comment || comment.length < 10 || comment.length > 350) {
      showError("Please enter a comment between 10 and 350 characters.");
      return;
    }
    if (rating < 1 || rating > 5 || difficulty < 1 || difficulty > 5) {
      showError("Please select a valid rating and difficulty.");
      return;
    }
    if (tags.length === 0) {
      showError("Please select at least one tag.");
      return;
    }

    const response = await addReview({
      class: `${className}${classNumber}`,
      comment,
      difficulty,
      rating,
      tags: tags.map((tag) => tag.value),
      grade,
      takeAgain,
      professorId: professorInfo.id,
    });
    if (response) {
      showError(response);
      return;
    }

    refresh({ fetchPolicy: "network-only" });
    setError("");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = document.documentElement.scrollTop;
      window.onscroll = function () {
        window.scrollTo(0, scrollY);
      };
    } else {
      window.onscroll = function () {};
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 shadow-lg"
      onClick={handleBackgroundClick}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg h-[90%] w-11/12 p-6 overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl">Review - {professorInfo?.name}</h1>
        <Divider />

        <form className="flex flex-col items-start gap-4" onSubmit={onSubmit}>
          <label className="font-semibold text-lg flex flex-col">
            Class Name
            <input
              className="border border-gray-400 hover:border-blue-500 focus:outline-blue-500 focus:ring-0 text-base font-normal px-2 py-1 w-72 rounded-sm"
              type="text"
              value={className}
              placeholder="CS"
              onChange={(e) => setClassName(e.target.value)}
            />
          </label>

          <label className="font-semibold text-lg flex flex-col">
            Class Number
            <input
              className="border border-gray-400 hover:border-blue-500 focus:outline-blue-500 focus:ring-0 text-base font-normal px-2 py-1 w-72 rounded-sm"
              type="number"
              value={classNumber}
              placeholder="146"
              onChange={(e) => setClassNumber(e.target.value)}
            />
          </label>

          <label className="font-semibold text-lg flex flex-col w-full lg:w-1/2">
            Comment
            <textarea
              className="resize-none border border-gray-400 px-2 py-1 hover:border-blue-500 focus:outline-blue-500 focus:ring-0 text-base font-normal h-36 lg:h-48 rounded-sm"
              value={comment}
              placeholder="I enjoyed this class because..."
              onChange={(e) => setComment(e.target.value)}
              maxLength="350"
            />
            <p className="text-sm font-normal text-gray-500 self-end">
              {comment.length}/350
            </p>
          </label>

          <label className="font-semibold text-lg flex flex-col">
            Rating
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                if (newValue >= 1) setRating(newValue);
              }}
            />
          </label>

          <label className="font-semibold text-lg flex flex-col">
            Difficulty
            <div className="flex items-center gap-3">
              <Rating
                value={difficulty}
                onChange={(event, newValue) => {
                  if (newValue >= 1) setDifficulty(newValue);
                }}
              />
              <span className="text-gray-500 text-sm font-normal">
                (1 is easiest)
              </span>
            </div>
          </label>

          <label className="font-semibold text-lg flex flex-col gap-1 w-full">
            Tags
            <MultiSelect selected={tags} setSelected={setTags} />
          </label>

          <label className="font-semibold text-lg flex flex-col gap-1 w-full">
            Grade
            <Select selected={grade} setSelected={setGrade} />
          </label>

          <label className="font-semibold text-lg flex flex-col gap-1">
            Take Again
            <input
              className="self-start scale-[120%] ml-2"
              type="checkbox"
              checked={takeAgain}
              onChange={(e) => setTakeAgain(e.target.checked)}
            />
          </label>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-3 py-2 mt-3 font-medium rounded-lg text-white bg-blue-500 active:scale-[0.98]"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 mt-3 font-medium rounded-lg text-blue-500 border border-blue-500 active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>

          <p className="text-red-500 text-lg font-medium" ref={errorRef}>
            {error}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Modal;
