import React from "react";
import AppointmentCard from "./AppointmentCard";

const AppointmentsGrid = ({ appointments }: { appointments: any[] }) => {
  let appointmentList = appointments.map((appointment) => {
    return <AppointmentCard appointment={appointment} key={appointment.id} />;
  });
  return (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
      {appointmentList}
    </div>
  );
};

export default AppointmentsGrid;
