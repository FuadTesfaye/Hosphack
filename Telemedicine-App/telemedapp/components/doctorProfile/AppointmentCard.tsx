import React from "react";
import stylesButton from "../navbarComp/navbar.module.css";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import ReadMore from "@/components/common/ReadMore";
import VideoCallButton from "@/components/common/VideoCallButton";

const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const userImage = <FaUserCircle className="h-20 w-20 text-[#035fe9]" />;

  return (
    <div
      className="bg-neutral-50 rounded-3xl md:p-6 p-4 shadow-lg flex flex-col md:space-y-3 space-y-2"
      key={appointment.appointment_id}
    >
      {/* Doctor/Patient Information */}
      <div className="flex items-center md:space-x-4 space-x-2">
        {userImage}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">
            {`${appointment.patient_first_name} ${appointment.patient_last_name}`}
          </h2>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Date:</strong>{" "}
            {" " + appointment.doctor_availability_day_hour.slice(0, 10)}
          </p>
          <p>
            <strong>Time & Duration:</strong>
            {" " +
              appointment.doctor_availability_day_hour.slice(11, 16)} |{" "}
            {appointment.appointment_duration + " mins"}
          </p>
          <p>
            <strong>Details:</strong>
            {" " + appointment.appointment_settings_type}{" "}
            {appointment.appointment_type === "First_time"
              ? "First Time"
              : "Follow Up"}
          </p>
          <p>
            <strong>Complaint:</strong>{" "}
            {appointment.appointment_complaint ? (
              <ReadMore text={appointment.appointment_complaint} />
            ) : (
              "N/A"
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-4">
          <Link
            href={`/doctorProfile/patientHistory/${appointment.appointment_patient_id}`}
            className="w-1/2"
          >
            <button className="md:text-sm text-xs font-medium text-white bg-[#60A899] py-2 px-4 rounded-lg hover:bg-[#4b8377] w-full">
              History
            </button>
          </Link>
          {/* My Appointments Button */}
          <Link
            href={`/doctorProfile/addPrescription/${appointment.appointment_id}`}
            className="w-1/2"
          >
            <button
              className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg w-full`}
            >
              Submit Results
            </button>
          </Link>
        </div>

        {/* Join Video Call Button */}
        <VideoCallButton label="Join Video Call" />
      </div>
    </div>
  );
};

export default AppointmentCard;
