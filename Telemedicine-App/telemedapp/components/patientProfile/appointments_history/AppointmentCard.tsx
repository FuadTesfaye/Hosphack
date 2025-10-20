import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from "../../../utils/date";
import HistoryDetails from "./HistoryDetails";

const AppointmentCard = ({
  appointment,
  profileData,
}: {
  appointment: any;
  profileData: any;
}) => {
  const userImage = <FaUserCircle className="h-20 w-20 text-[#035fe9]" />;

  // Buffer to Base64 conversion for the doctor's image
  const bufferToBase64 = (buffer: number[]) => {
    const binary = String.fromCharCode.apply(null, buffer);
    return window.btoa(binary);
  };

  const base64Image = appointment.image
    ? `data:image/jpeg;base64,${bufferToBase64(appointment.image.data)}`
    : ""; // Placeholder for missing image

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col space-y-3 border border-gray-200">
      {/* Doctor Information */}
      <div className="flex items-center space-x-4">
        {base64Image ? (
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={base64Image}
            alt="Doctor"
          />
        ) : (
          userImage
        )}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900">{`Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</h2>
          <p className="text-sm text-[#035fe9] font-medium">
            {appointment.doctor_specialization || "Specialist"}
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="text-sm text-gray-600 space-y-2">
        <p>
          <strong>Duration:</strong> {appointment.appointment_duration} min
        </p>
        <p>
          <strong>Appointment Type:</strong> {appointment.appointment_type}
        </p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {appointment.doctor_availability_day_hour &&
            formatDate(appointment.doctor_availability_day_hour)}
        </p>
      </div>

      {/* Follow-Up Button */}
      <HistoryDetails appointment={appointment} />
    </div>
  );
};

export default AppointmentCard;
