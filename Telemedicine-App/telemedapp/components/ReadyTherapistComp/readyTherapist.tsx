import React from "react";
import { GoDotFill } from "react-icons/go";

const ReadyTherapist = () => {
  return (
    <section>
      <div className="bg-white rounded-3xl p-4 flex flex-col space-y-8 max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto">
        <div className="text-[#343a40] font-bold text-3xl">
          If you need to talk now, we are here to help you
        </div>
        <div className="flex justify-between items-center">
          <div>
            <img className="w-20 h-20" src="/assets/logo.png" alt="" />
          </div>
          <div className="flex items-center text-xs md:text-xl">
            <GoDotFill className="rounded-full bg-lime-600 max-w-1 max-h-1 p-1 mr-4" />
            3 Doctor are ready to start now within 15 mins
          </div>
          <button className="border border-[#035fe9] rounded-lg text-[#035fe9] p-2 md:px-12 md:py-2">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReadyTherapist;
