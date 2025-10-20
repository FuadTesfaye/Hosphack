"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import ReadMore from "@/components/common/ReadMore";
import Image from "next/image";
import userImage from "@/images/user.png";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  languages: string;
}

const Requests = () => {
  const { profileData, loading } = useProfile();

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  const [requests, setRequests] = useState([
    {
      appointment_id: "",
      appointment_patient_id: "",
      patient_first_name: "",
      patient_last_name: "",
      doctor_availability_day_hour: "",
      appointment_duration: "",
      appointment_type: "",
      appointment_settings_type: "",
      appointment_complaint: "",
    },
  ]);

  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/Doctor/Profile/PendingRequests`,
      {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    )
      .then((response) => response.json())
      .then((response) => setRequests(() => response))
      .finally(() => setLoadingRequest(false));
  }, [profileData]);

  const handleResolveRequest = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const buttonName = e.currentTarget.name;
    const appointmentID = e.currentTarget.value;

    try {
      const token = localStorage.getItem("jwt");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctor/AppointmentResponse/${appointmentID}/${buttonName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        },
      );

      if (!response.ok) {
        if (buttonName === "accept") {
          throw new Error("Failed To Accept Request");
        } else if (buttonName === "decline") {
          throw new Error("Failed To Decline Request");
        }
      }

      window.location.href = "/doctorProfile/requests";
    } catch (error) {
      if (buttonName === "accept") {
        console.error("Error While Accepting Request", error);
      } else if (buttonName === "decline") {
        console.error("Error While Declining Request", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 h-full w-full flex flex-col items-center justify-center gap-5 min-[880px]:flex-row min-[880px]:items-start">
      {loadingRequest ? (
        <CircularProgress className="mx-auto my-4" />
      ) : (
        <>
          <div className="p-7">
            <div className="grid grid-cols-1 min-[1350px]:grid-cols-2 p-3 gap-y-10 justify-items-center">
              {requests.length > 0 ? (
                requests.map((request) => {
                  return (
                    <>
                      <div
                        className="min-w-80 max-w-[400px] h-fit flex flex-col p-2 gap-2 rounded-lg bg-neutral-50 shadow-lg"
                        key={request.appointment_id}
                      >
                        <div className="flex gap-3">
                          <Image
                            className="inline-block h-20 w-20 rounded-full"
                            src={userImage}
                            alt="Doctor Image"
                          />
                          <p className="font-bold pt-1 self-center">
                            {request.patient_first_name}{" "}
                            {request.patient_last_name}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p>
                            <span className="font-semibold text-gray-600">
                              Date:
                            </span>
                            {" " +
                              request.doctor_availability_day_hour.slice(0, 10)}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-600">
                              Time & Duration:
                            </span>
                            {" " +
                              request.doctor_availability_day_hour.slice(
                                11,
                                16,
                              )}{" "}
                            | {request.appointment_duration + " mins"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-600">
                              Details:
                            </span>
                            {" " + request.appointment_settings_type}{" "}
                            {request.appointment_type === "First_time"
                              ? "First Time"
                              : "Follow Up"}
                          </p>
                        </div>
                        <div className="max-w-[400px] whitespace-break-spaces break-words">
                          <div>
                            <strong>Complaint:</strong>{" "}
                            {request.appointment_complaint ? (
                              <ReadMore text={request.appointment_complaint} />
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between gap-2">
                            <button
                              name="accept"
                              value={request.appointment_id}
                              className="rounded-full border-none bg-emerald-600 text-white w-40 px-4 py-2 hover:scale-105 hover:cursor-pointer"
                              onClick={handleResolveRequest}
                            >
                              Accept
                            </button>
                            <button
                              name="decline"
                              value={request.appointment_id}
                              className="rounded-full border-none bg-red-600 text-white w-40 px-4 py-2 hover:scale-105 hover:cursor-pointer"
                              onClick={handleResolveRequest}
                            >
                              Decline
                            </button>
                          </div>
                          <div className="flex justify-between gap-2">
                            <button
                              className="rounded-full border-none  w-40 px-4 py-2 bg-indigo-400 text-white hover:scale-105 hover:cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/doctorProfile/patientHistory/${request.appointment_patient_id}`)
                              }
                            >
                              Medical History
                            </button>
                            <button
                              className="rounded-full border-none bg-blue-500 text-white w-40 px-4 py-2 hover:scale-105 hover:cursor-pointer"
                              onClick={() =>
                                (window.location.href = "/doctorProfile/chat")
                              }
                            >
                              Ask For Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p className="font-semibold text-center  md:text-xl md:absolute md:left-[30%] md:top-[50%]">
                  There Are Currently No Requests
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Requests;
