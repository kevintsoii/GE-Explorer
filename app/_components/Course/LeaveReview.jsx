import React from "react";

import Tooltip from "@mui/material/Tooltip";
import { MessageCirclePlus } from "lucide-react";

const LeaveReview = () => {
  return (
    <div className="flex items-center">
      <Tooltip title="Leave a Review" placement="top">
        <button>
          <MessageCirclePlus className="text-blue-500 mb-2" size={24} />
        </button>
      </Tooltip>
    </div>
  );
};

export default LeaveReview;
