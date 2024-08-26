import React from "react";
import { CircleX } from "lucide-react";

const Error = () => {
  return (
    <div className="flex flex-col self-center text-center items-center bg-red-300 p-6 rounded-lg gap-4 text-lg">
      <CircleX strokeWidth={1.5} size={100} />
      An error occured. Please try again later!
    </div>
  );
};

export default Error;
