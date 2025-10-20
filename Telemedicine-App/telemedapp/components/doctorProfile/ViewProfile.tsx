"use client";

import Link from "next/link";
import { useProfile } from "@/context/ProfileContext"; // Ensure correct import path
import { useRouter } from "next/navigation";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  languages: string;
}

function ViewProfile() {
  const { profileData, loading } = useProfile();
  const router = useRouter();

  const profileFields = [
    { name: "firstName", title: "First Name" },
    { name: "lastName", title: "Last Name" },
    { name: "phone", title: "Phone Number" },
    { name: "email", title: "Email" },
    { name: "birthDate", title: "Date Of Birth" },
    { name: "gender", title: "Gender" },
    { name: "residenceCountry", title: "Residence Country" },
    { name: "specialization", title: "Specialization" },
    { name: "languages", title: "Languages" },
    { name: "thirtyMinPrice", title: "30 Minutes Price" },
    { name: "sixtyMinPrice", title: "60 Minutes Price" },
  ];

  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/auth/signin");
  };

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }
  return (
    <div className="m-4">
      <div className="flex flex-col min-[450px]:flex-row min-[450px]:gap-10 lg:gap-24 xl:gap-56">
        <div>
          {profileFields.slice(0, 6).map((field) => {
            return (
              <div key={field.name} className="mb-3">
                <p className="font-extrabold">{field.title}</p>
                <p>{profileData[field?.name as keyof ProfileData]}</p>
              </div>
            );
          })}
        </div>
        <div className="mb-5">
          {profileFields.slice(6).map((field) => {
            return (
              <div key={field.name} className="mb-3">
                <p className="font-extrabold">{field.title}</p>
                <p>{profileData[field?.name as keyof ProfileData]}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="mt-5">
          <Link
            href="/doctorProfile/changePassword"
            className="font-medium p-3 border border-solid text-green-600 border-green-600 rounded-full"
          >
            Change Password
          </Link>
        </div>
        <div className="mt-5 mb-3">
          <button
            onClick={handleSignOut}
            className="font-medium p-3 border border-solid text-red-600 border-red-600 rounded-full"
          >
            Sign Out
          </button>
        </div>
      </div>
      <Link
        href="/doctorProfile/edit"
        className="flex gap-1 justify-center items-center font-medium absolute top-[12.5%] right-[5%] min-[370px]:top-[10%] min-[450px]:top-[80%] min-[880px]:top-[15%]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 fill-green-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <p className="text-green-500 underline">Edit Profile</p>
      </Link>
    </div>
  );
}

export default ViewProfile;
