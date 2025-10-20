"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppointmentHistorySummary from "@/components/patientHistoryComps/appointmentHistorySummary";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const PatientHistory = () => {
  const { appointmentPatientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [appointmentHistory, setAppointmentHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      window.location.href = "/auth/signin";
    } else if (
      Math.floor(new Date().getTime() / 1000) >
      Number(localStorage.getItem("expiryDate"))
    ) {
      localStorage.clear();
      window.location.href = "/auth/signin";
    } else {
      const headers = {
        Authorization: "Bearer " + token,
      };
      fetchAppointmentHistory(appointmentPatientId, headers);
    }
  }, []);

  useEffect(() => {
    setLoading(() => false);
  }, [appointmentHistory]);

  const fetchAppointmentHistory = async (patientId: any, headers: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctor/PatientSummary/${patientId}`,
      { headers, mode: "cors" },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prescriptions");
    }
    const data = await response.json();
    setAppointmentHistory(data.appointments);
  };

  return (
    <main className="flex-col space-y-6">
      {loading ? (
        <CircularProgress className="absolute top-1/2 left-1/2" />
      ) : (
        <>
          <section className="max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {appointmentHistory ? (
              <AppointmentHistorySummary
                appointmentHistory={appointmentHistory}
              />
            ) : (
              <p className="text-3xl text-black col-span-2 absolute left-[40%] top-1/2">
                No past appointments
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default PatientHistory;
