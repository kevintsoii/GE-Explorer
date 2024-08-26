import React from "react";

import AreaCard from "./AreaCard";

const AreaGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
      {data.map((area) => (
        <AreaCard
          key={area.area}
          area={area.area}
          title={area.title}
        ></AreaCard>
      ))}
    </div>
  );
};

export default AreaGrid;
