import React from "react";
import Select from "react-select";

const SearchBox = ({ setSelected, placeholder = "Select...", options }) => {
  const onSelect = (values) => {
    setSelected(values.map((value) => value.value));
  };

  return (
    <div className="w-full lg:w-[600px]">
      <Select
        isMulti
        placeholder={placeholder}
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={onSelect}
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

export default SearchBox;
