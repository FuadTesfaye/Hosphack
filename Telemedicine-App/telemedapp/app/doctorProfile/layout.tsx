"use client";

import React from "react";
import "../globals.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData, loading } = useProfile();
  const userImage = <FaUserCircle className="h-32 w-32 text-[#035fe9]" />;
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="bg-gray-100 h-full w-full flex flex-col items-center justify-center gap-5 min-[880px]:flex-row min-[880px]:items-start">
      {loading ? (
        <CircularProgress className="absolute top-1/2" />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex-initial flex flex-col justify-center items-center my-5 bg-white h-fit w-fit p-4 rounded-xl">
              {userImage}
              <p className="text-blue-500 mb-1 font-semibold">
                {`Dr. ${profileData?.firstName.toUpperCase()} ${profileData?.lastName.toUpperCase()}`}
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              onClick={() => router.push("/doctorProfile/appointments")}
            >
              My Appointments
            </button>
          </div>

          <div className="flex-initial m-5 bg-white rounded-xl relative max-w-lg min-w-0 md:basis-7/12 md:max-w-full">
            <div className="flex pt-4 mb-3 justify-around gap-1 px-2  md:text-base text-sm">
              <Link
                href="/doctorProfile"
                className={`${
                  pathname === "/doctorProfile"
                    ? "text-blue-500 font-bold "
                    : "font-bold"
                } `}
              >
                Personal Info
              </Link>
              <Link
                href="/doctorProfile/timeSlots"
                className={`${
                  pathname === "/doctorProfile/timeSlots"
                    ? "text-blue-500 font-bold "
                    : "font-bold"
                }`}
              >
                Time Slots
              </Link>
              <Link
                href="/doctorProfile/requests"
                className={`${
                  pathname === "/doctorProfile/requests"
                    ? "text-blue-500 font-bold "
                    : "font-bold"
                } `}
              >
                Pending Requests
              </Link>
            </div>
            <div className="flex">
              <hr
                className={`${
                  pathname === "/doctorProfile"
                    ? "bg-blue-500"
                    : "bg-neutral-800"
                } border-none h-0.5 w-1/3`}
              />
              <hr
                className={`${
                  pathname === "/doctorProfile/timeSlots"
                    ? "bg-blue-500"
                    : "bg-neutral-800"
                } border-none h-0.5 w-1/3`}
              />
              <hr
                className={`${
                  pathname === "/doctorProfile/requests"
                    ? "bg-blue-500"
                    : "bg-neutral-800"
                } border-none h-0.5 w-1/3`}
              />
            </div>
            <main>{children}</main>
          </div>
        </>
      )}
    </div>
  );
}
