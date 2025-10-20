import React from "react";

const Benefits = () => {
  return (
    <section>
      <div className="max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto flex flex-col space-y-20">
        <div className="text-[#343a40] font-bold text-3xl mx-auto">
          Our Members Benefit From
        </div>
        <div className="flex flex-col space-y-20 md:space-y-0 md:flex-row md:space-x-6 justify-between">
          <div className="bg-white rounded-2xl p-4 flex flex-col space-y-4 shadow-2xl md:max-w-[33%]">
            <div className="flex justify-between relative">
              <h3 className="text-[#035fe9] font-bold">Save time and effort</h3>
              <img
                className="absolute top-[-64px] right-0"
                src="assets/b1.svg"
                alt=""
              />
            </div>
            <p>
              Get your session online. No waiting lists, no transportation
              hassles
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-col space-y-4 shadow-2xl md:max-w-[33%]">
            <div className="flex justify-between relative">
              <h3 className="text-[#035fe9] font-bold">Responsive team</h3>
              <img
                className="absolute top-[-64px] right-0"
                src="assets/b2.svg"
                alt=""
              />
            </div>
            <p>
              Our support team is available to help you take your first step and
              answer non-clinical
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-col space-y-4 shadow-2xl md:max-w-[33%]">
            <div className="flex justify-between relative">
              <h3 className="text-[#035fe9] font-bold">Variety of options</h3>
              <img
                className="absolute top-[-64px] right-0"
                src="assets/b3.svg"
                alt=""
              />
            </div>
            <p>
              A large number of Doctors in various specialties ready to help you
              with whatever you're facing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
