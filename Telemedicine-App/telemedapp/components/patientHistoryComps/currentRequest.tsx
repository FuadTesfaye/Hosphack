import React from "react";
import { getTimeString } from "@/utils/date";

const CurrentRequest = ({
  isFollowUp,
  time,
  complaint,
}: {
  isFollowUp: string;
  time: string;
  complaint: string;
}) => {
  return (
    <div className="col-span-2 md:col-span-1 flex flex-col space-y-4 p-4 border border-[#919395] rounded-[10px]">
      <h2 className="text-lg font-semibold">Current Request</h2>
      <div>
        <div className="flex justify-between items-center space-x-2">
          <p className="text-sm md:text-lg font-semibold">{isFollowUp}</p>
          <p className="text-sm md:text-lg">{getTimeString(time)}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 md:space-y-4">
        <div className="text-sm md:text-lg font-semibold">Complaint:</div>
        <div className="italic text-sm md:text-lg grow">{complaint}</div>
      </div>
    </div>
  );
};

export default CurrentRequest;
