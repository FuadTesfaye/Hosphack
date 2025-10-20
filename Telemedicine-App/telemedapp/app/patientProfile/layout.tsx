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
    <div>
      <div className="bg-gray-100 w-full flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        {loading ? (
          <CircularProgress className="absolute top-1/2" />
        ) : (
          <>
            <div className="flex flex-col items-center ">
              <div className="flex-initial flex flex-col justify-center items-center my-5 bg-white h-fit w-fit p-4 rounded-xl">
                {userImage}
                <p className="text-blue-500 mb-1 font-semibold">
                  {`${profileData?.firstName.toUpperCase()} ${profileData?.lastName.toUpperCase()}`}
                </p>
              </div>
              <div className="flex flex-col gap-3 font-semibold text-sm">
                <button
                  className=" bg-blue-600 text-white py-3 px-1 rounded-lg"
                  onClick={() =>
                    router.push("/patientProfile/upcoming_appointments")
                  }
                >
                  Upcoming Appointments
                </button>
                <button
                  className=" bg-blue-600 text-white py-3 px-1 rounded-lg"
                  onClick={() =>
                    router.push("/patientProfile/appointments_history")
                  }
                >
                  Appointments History
                </button>
              </div>
            </div>
            <div className="flex-initial m-5 bg-white rounded-xl relative max-w-lg min-w-0 md:basis-7/12 md:max-w-full">
              <div className="flex pt-4 mb-3 justify-around gap-2 px-2  md:text-base text-sm">
                <Link
                  href="/patientProfile"
                  className={`${
                    pathname === "/patientProfile"
                      ? "text-blue-500 font-bold "
                      : "font-bold"
                  } `}
                >
                  Personal Info
                </Link>
                <Link
                  href="/patientProfile/paymentInfo"
                  className={`${
                    pathname === "/patientProfile/paymentInfo"
                      ? "text-blue-500 font-bold "
                      : "font-bold"
                  }`}
                >
                  Payment Info
                </Link>
                <Link
                  href="/patientProfile/patientDocuments"
                  className={`${
                    pathname === "/patientProfile/patientDocuments"
                      ? "text-blue-500 font-bold "
                      : "font-bold"
                  } `}
                >
                  Documents
                </Link>
              </div>
              <div className="flex">
                <hr
                  className={`${
                    pathname === "/patientProfile"
                      ? "bg-blue-500"
                      : "bg-neutral-800"
                  } border-none h-0.5 w-1/3`}
                />
                <hr
                  className={`${
                    pathname === "/patientProfile/paymentInfo"
                      ? "bg-blue-500"
                      : "bg-neutral-800"
                  } border-none h-0.5 w-1/3`}
                />
                <hr
                  className={`${
                    pathname === "/patientProfile/patientDocuments"
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
    </div>
  );
}
