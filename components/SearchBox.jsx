import React from "react";
import { Search } from "lucide-react";

const SearchBox = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
}) => {
  return (
    <label
      className={
        "flex self-start items-center gap-2 border border-gray-400 rounded-lg px-4 py-2.5 focus-within:border-blue-500 justify-between w-full md:w-[400px] " +
        (searchQuery && "border-blue-500")
      }
    >
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex flex-grow focus:outline-none"
      ></input>
      <Search
        strokeWidth={1.5}
        size={22}
        className={`${searchQuery ? "text-blue-500" : "text-gray-500"}`}
      />
    </label>
  );
};

export default SearchBox;
