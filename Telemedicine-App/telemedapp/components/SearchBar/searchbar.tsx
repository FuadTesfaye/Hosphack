import React from "react";
import { IoIosSearch } from "react-icons/io";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="col-span-1 md:col-span-2 flex items-center border border-[#cccccc] rounded-xl max-h-[50px]">
      <IoIosSearch className="w-4 h-4 m-2" />
      <input
        className="w-full me-1 px-3 py-1.5 grow border focus:outline-0"
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
};

export default SearchBar;
