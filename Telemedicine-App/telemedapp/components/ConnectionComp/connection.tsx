import React from "react";
import { PiSmileySad } from "react-icons/pi";
import { TbMoodSadDizzy } from "react-icons/tb";
import { IoSadOutline } from "react-icons/io5";
import { FaPumpMedical } from "react-icons/fa6";
import { PiSyringeDuotone } from "react-icons/pi";
import { MdNoFood } from "react-icons/md";
import { MdOutlinePeople } from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";

const Connection = () => {
  return (
    <section className="mb-4">
      <div className="flex flex-col space-y-8 max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto">
        <div className="text-[#343a40] font-bold text-3xl mx-auto">
          We Connect You With Licensed Doctor
        </div>
        <div className="text-[#035fe9] text-2xl mx-auto">
          Select the speciality that fits your need.
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <PiSmileySad className="text-4xl font-bold" />
            <span>Depression</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <TbMoodSadDizzy className="text-4xl font-bold" />
            <span>Mood Disorders</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <IoSadOutline className="text-4xl font-bold" />
            <span>Anxiety Disorders</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <FaPumpMedical className="text-4xl font-bold" />
            <span>OCD</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <PiSyringeDuotone className="text-4xl font-bold" />
            <span>Addiction</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <MdNoFood className="text-4xl font-bold" />
            <span>Eating Disorders</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <MdOutlinePeople className="text-4xl font-bold" />
            <span>Couple Therapy</span>
          </div>
          <div className="text-[#035fe9] bg-white rounded-2xl p-4 flex items-center justify-center space-x-4 text-xl font-medium shadow-xl">
            <TbAppsFilled className="text-4xl font-bold rotate-180" />
            <span>Others</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connection;
