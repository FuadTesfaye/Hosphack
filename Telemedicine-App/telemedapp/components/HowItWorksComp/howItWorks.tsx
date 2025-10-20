import React from "react";

const HowItWorks = () => {
  return (
    <section className="mb-4">
      <div className="flex flex-col space-y-8 max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto">
        <h1 className="text-[#343a40] font-bold text-3xl mx-auto">
          How it works
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 bg-white rounded-2xl p-4 shadow-xl px-[5%] pt-[5%]">
          <div className="flex space-x-8">
            <img src="assets/hiw1.svg" alt="" />
            <div className="flex flex-col justify-between space-y-8">
              <div className="text-[#035fe9] font-bold">
                1. Signup as a customer
              </div>
              <div className="text-[#212529] text-xs">
                Answer a few questions to get matched with the right doctor. You
                can also select the doctor yourself
              </div>
            </div>
          </div>
          <div className="flex space-x-8">
            <img src="assets/hiw2.svg" alt="" />
            <div className="flex flex-col justify-between space-y-8">
              <div className="text-[#035fe9] font-bold">
                2. Book your session
              </div>
              <div className="text-[#212529] text-xs">
                Choose date and time that suits you and pay using different
                payment methods
              </div>
            </div>
          </div>
          <div className="md:col-span-2 flex space-x-8 justify-center md:px-[28%]">
            <img src="assets/hiw3.svg" alt="" />
            <div className="flex flex-col justify-between space-y-8">
              <div className="text-[#035fe9] font-bold">
                3. Start your journey
              </div>
              <div className="text-[#212529] text-xs">
                You can communicate with your doctor in different ways during
                the session: camera, mic, and chatting
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
