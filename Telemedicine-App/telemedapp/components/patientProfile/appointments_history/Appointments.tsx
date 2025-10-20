"use client";
import React, { useEffect, useState } from "react";
import AppointmentsGrid from "./AppointmentsGrid";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Appointments: React.FC = () => {
  const { profileData, loading } = useProfile();
  const [appointments, setAppointments] = useState<any[]>([]);

   useEffect(() => {
     setTimeout(async () => {
     const storedAppointments = localStorage.getItem("appointments");
     if (storedAppointments) {
       setAppointments(JSON.parse(storedAppointments));
     }
     else {
       setAppointments([
         {
           id: 1,
           doctor_availability_day_hour: "2022-01-01T10:00:00",
           appointment_duration: 30,
           appointment_type: "First_time",
           appointment_complaint: "N/A",
           appointment_settings_type: "Video",
           patient_first_name: "John",
           patient_last_name: "Doe",
         },
         {
           id: 2,
           doctor_availability_day_hour: "2022-01-02T11:00:00",
           appointment_duration: 15,
           appointment_type: "Follow_up",
           appointment_complaint: "N/A",
           appointment_settings_type: "Audio",
           patient_first_name: "Jane",
           patient_last_name: "Doe",
         },
       ]);
     }
   }, 2000); // Simulate loading delay
 
 }, [profileData]);

  return (
    <div className=" flex flex-col m-4 ">
      {appointments?.length > 0 ? (
        <AppointmentsGrid
          appointments={appointments}
          profileData={profileData}
        />
      ) : (
        <p className="font-semibold">
          {loading ? "Loading..." : "No Appointment History Available"}
        </p>
      )}
    </div>
  );
};

export default Appointments;
