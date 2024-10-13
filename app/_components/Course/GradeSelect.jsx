import React from "react";

const gradeOptions = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
];

const Select = ({ selected, setSelected }) => {
  return (
    <div
      className={
        "flex self-start items-center gap-2 border border-gray-400 rounded-lg px-4 py-2.5 focus-within:border-blue-500 justify-between w-full md:w-[400px] font-normal text-base"
      }
    >
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={
          "flex flex-grow focus:outline-none h-[24px] " +
          (selected ? "text-black" : "text-gray-400")
        }
      >
        {gradeOptions.map((option) => (
          <option className="text-black" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
