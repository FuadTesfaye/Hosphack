"use client";
import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "100%",
    paddingTop: "6px",
    paddingBottom: "6px",
    paddingLeft: "12px",
    paddingRight: "12px",
    border: "1px solid #cccccc",
    borderRadius: "0.75rem",
    boxShadow: "none",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#E5EFFC" : "white",
    color: state.isFocused ? "#035fe9" : "black",
    "&:hover": {
      backgroundColor: "#E5EFFC",
      color: "#035fe9",
    },
  }),
};

const SortDropDown = ({
  options,
  name,
  id,
  isMulti,
  handleChangeFilter,
}: {
  options: any[];
  name: string;
  id: string;
  isMulti: boolean;
  handleChangeFilter: any;
}) => {
  return (
    <Select
      options={options}
      onChange={(e, actionMeta) => handleChangeFilter(e, actionMeta)}
      styles={customStyles}
      isMulti={isMulti}
      name={name}
      placeholder={`Select ${name}`}
      id={id}
    />
  );
};

export default SortDropDown;
