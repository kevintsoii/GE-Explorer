import React from "react";

const SearchBox = ({
  sortOrder,
  setSortOrder,
  placeholder = "Select...",
  options,
}) => {
  return (
    <label
      className={
        "flex self-start items-center gap-2 border border-gray-400 rounded-lg px-4 py-2.5 focus-within:border-blue-500 justify-between w-full md:w-[400px]"
      }
    >
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className={
          "flex flex-grow focus:outline-none h-[24px] " +
          (sortOrder ? "text-black" : "text-gray-400")
        }
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option className="text-black" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SearchBox;
