"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import AppointmentsGrid from "./AppointmentsGrid";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path

const Appointments = () => {
  const { profileData } = useProfile();
  const [appointments, setAppointments] = useState<Array<{
    id: number;
    doctor_availability_day_hour: string;
    appointment_duration: number;
    appointment_type: string;
    appointment_complaint: string;
    appointment_settings_type: string;
    patient_first_name: string;
    patient_last_name: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
    setLoading(true);
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
      setLoading(false);
  }, 2000); // Simulate loading delay

}, [profileData]);
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <CircularProgress />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center my-4">No profile data available.</div>
    );
  }
  return (
    <div className="flex flex-col m-4 p-7">
      {appointments?.length > 0 ? (
        <AppointmentsGrid appointments={appointments} />
      ) : (
        <div className="flex justify-center text-xl font-semibold">
          No appointments available
        </div>
      )}
    </div>
  );
};

export default Appointments;
