import React from "react";
import Select from "react-select";

const tagOptions = [
  "Tough Grader",
  "Get Ready To Read",
  "Participation Matters",
  "Extra Credit",
  "Group Projects",
  "Amazing Lectures",
  "Clear Grading Criteria",
  "Gives Good Feedback",
  "Inspirational",
  "Lots Of Homework",
  "Hilarious",
  "Beware Of Pop Quizzes",
  "So Many Papers",
  "Caring",
  "Respected",
  "Lecture Heavy",
  "Test Heavy",
  "Graded By Few Things",
  "Accessible Outside Class",
  "Online Savvy",
];

const MultiSelect = ({ selected, setSelected }) => {
  return (
    <div className="w-full md:w-[600px] font-normal text-base">
      <Select
        isMulti
        value={selected}
        options={tagOptions.map((option) => ({ value: option, label: option }))}
        isOptionDisabled={() => selected.length >= 3}
        onChange={setSelected}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "8px",
            marginBottom: "8px",
            borderColor: state.isFocused
              ? "rgb(59 130 246)"
              : "rgb(156 163 175)",
            borderWidth: "1px",
            boxShadow: "none",
            borderRadius: "8px",
          }),
          clearIndicator: (baseStyles) => ({
            ...baseStyles,
            transform: "scaleX(1.1)",
            ":hover": {
              color: "rgb(185 28 28)",
            },
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            transform: "scaleX(1.1)",
          }),
        }}
      />
    </div>
  );
};

export default MultiSelect;
