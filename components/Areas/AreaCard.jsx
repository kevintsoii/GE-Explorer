import React from "react";

const AreaCard = ({ area, title }) => {
  return (
    <div className="flex flex-col border rounded-lg min-h-24 py-3 px-3 hover:border-blue-500">
      <h1 className="text-lg">{area}</h1>
      <h2 className="text-gray-600">{title}</h2>
    </div>
  );
};

export default AreaCard;
