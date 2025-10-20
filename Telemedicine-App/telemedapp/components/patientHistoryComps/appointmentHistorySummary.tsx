import React from "react";
import AppointmentHistoryCard from "./appointmentHistoryCard";

const AppointmentHistorySummary = ({
  appointmentHistory,
}: {
  appointmentHistory: any[];
}) => {
  let appointmentHistoryCards = appointmentHistory.map((appointment, index) => {
    return <AppointmentHistoryCard key={index} appointment={appointment} />;
  });
  return (
    <div className="col-span-2 grid grid-cols-2 gap-4">
      <h2 className="col-span-2 text-lg font-semibold p-4">
        Past Appointments:
      </h2>
      {appointmentHistoryCards}
    </div>
  );
};

export default AppointmentHistorySummary;
