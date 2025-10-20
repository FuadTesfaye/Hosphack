import React from "react";
import buttonStyles from "../navbarComp/navbar.module.css";
import Link from "next/link";
const Banner = () => {
  return (
    <section className="h-screen flex flex-col-reverse md:flex md:flex-row md:ml-[12.5%]">
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-col p-2 space-y-6">
          <p className="text-xs text-[#343a40] font-light">YOU TALK WE HELP</p>
          <h1 className="text-black text-5xl md:text-6xl font-light">
            Talk{" "}
            <span className="font-bold">to your doctor online privately </span>{" "}
            anytime anywhere!
          </h1>
          <p className="text-base md:text-lg font-semibold text-[#343a40]">
            TeleMedPilot is number one in online Arabic Telemedicine worldwide.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 md:max-w-[80%]">
          <Link className="min-w-[80%] md:min-w-full" href="/doctors">
            <button
              className={
                buttonStyles.gradient_button +
                " md:px-12 py-2 my-2 text-base md:text-lg text-white rounded-lg w-full "
              }
            >
              Explore Our Doctors
            </button>
          </Link>
          <button className="text-base md:text-lg border border-[#035fe9] rounded-lg text-[#035fe9] min-w-[80%] md:min-w-full md:px-12 py-2">
            Get Matched With a Doctor
          </button>
        </div>
      </div>
      <div>
        <img className="object-cover" src="assets/banner.jpg" alt="banner" />
      </div>
    </section>
  );
};

export default Banner;
