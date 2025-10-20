import React from "react";

const Trusted = () => {
  return (
    <section className="mb-4">
      <div className="max-w-full md:max-w-[90%] lg:max-w-[75%] mx-auto flex flex-col space-y-8">
        <div className="text-[#343a40] font-bold text-3xl mx-auto">
          We have been trusted by
        </div>
        <div className="grid grid-cols-2 md:flex md:justify-around">
          <img className="w-28 h-28" src="assets/logo.png" alt="" />
          <img className="w-28 h-28" src="assets/logo.png" alt="" />
          <img className="w-28 h-28" src="assets/logo.png" alt="" />
          <img className="w-28 h-28" src="assets/logo.png" alt="" />
          <img className="w-28 h-28" src="assets/logo.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Trusted;
