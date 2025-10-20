"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineEventAvailable } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { LuShapes } from "react-icons/lu";
import { IoStopwatchOutline } from "react-icons/io5";
import { IoMaleFemaleSharp } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SortDropDown from "../SortDropDown/sortdropdown";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { formatDate, getWeekStartAndEnd } from "@/utils/date";

const EmptyIcon = () => null;
const FilterComponent = ({
  handleChangeFilterDrop,
  handleResetFilters,
  handleChangeOptions,
  handleOpenModal,
  openModal,
  minFees,
  maxFees,
  specializationOptions,
  countryOptions,
  languageOptions,
}: {
  handleChangeFilterDrop: any;
  handleResetFilters: any;
  handleChangeOptions: any;
  handleOpenModal: any;
  openModal: any;
  minFees: number;
  maxFees: number;
  specializationOptions: string[];
  countryOptions: string[];
  languageOptions: string[];
}) => {
  const [value, setValue] = useState<number[]>([0, 1000]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [showRange2, setShowRange2] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleOpen2 = () => {
    setOpen2(!open2);
  };

  const handleChangeSlider = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[],
  ) => {
    const simulatedEvent = {
      target: {
        name: "price",
        value: newValue,
      },
    };
    handleChangeOptions(simulatedEvent);
  };
  const handleRenewSlider = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  const handleChangeDate = () => {
    handleOpen();
    setShowRange2(true);
  };
  const handleChangeDate2 = () => {
    handleOpen2();
  };
  const today = new Date();

  return (
    <>
      {!openModal ? (
        <aside className="flex flex-col space-y-6 p-4 border border-[#919395] rounded-[10px] max-h-fit hidden lg:inline-block">
          <h2 className="text-[#035fe9] text-lg font-bold text-center">
            Filters
          </h2>
          <hr />
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <MdOutlineEventAvailable className="w-6 h-6 mr-2" /> Availability
            </h3>
            <div className="grid grid-cols-2 w-full">
              <div>
                <input
                  id="today"
                  name="todayDate"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? formatDate(today) : "",
                      },
                    })
                  }
                  value={formatDate(today)}
                  type="checkbox"
                />
                <label htmlFor="today"> Today</label>
              </div>
              <div>
                <input
                  id="this week"
                  name="thisWeek"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked
                          ? getWeekStartAndEnd(today)
                          : "",
                      },
                    })
                  }
                  value={getWeekStartAndEnd(today)}
                  type="checkbox"
                />
                <label htmlFor="this week"> This Week</label>
              </div>
              <div>
                <input
                  id="online"
                  name="isOnline"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? "true" : "",
                      },
                    })
                  }
                  value="true"
                  type="checkbox"
                />
                <label htmlFor="online"> Online</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <MdDateRange className="w-6 h-6 mr-2" /> Specific date or range
            </h3>
            <div onClick={handleOpen}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Choose a date"
                    sx={{ width: 1, borderRadius: 4 }}
                    open={open}
                    onChange={handleChangeDate}
                    closeOnSelect={true}
                    slots={{ openPickerIcon: EmptyIcon }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            {showRange2 ? (
              <div onClick={handleOpen2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Choose a date"
                      sx={{ width: 1, borderRadius: 4 }}
                      open={open2}
                      onChange={handleChangeDate2}
                      closeOnSelect={true}
                      slots={{ openPickerIcon: EmptyIcon }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <LuShapes className="w-6 h-6 mr-2" /> Areas of interest
            </h3>
            <div>
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={specializationOptions}
                name="speciality"
                id="speciality"
                isMulti={true}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <IoStopwatchOutline className="w-6 h-6 mr-2" /> Duration
            </h3>
            <div className="flex space-x-4">
              <div>
                <input
                  id="30mins"
                  name="30mins"
                  value="30mins"
                  type="checkbox"
                />
                <label htmlFor="30mins"> 30 mins</label>
              </div>
              <div>
                <input
                  id="60mins"
                  name="60mins"
                  value="60mins"
                  type="checkbox"
                />
                <label htmlFor="60mins"> 60 mins</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <IoMaleFemaleSharp className="w-6 h-6 mr-2" /> Doctor Gender
            </h3>
            <div className="flex space-x-4">
              <div>
                <input
                  id="male"
                  name="gender"
                  value="Male"
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="male"> Male</label>
              </div>
              <div>
                <input
                  id="female"
                  name="gender"
                  value="Female"
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="female"> Female</label>
              </div>
              <div>
                <input
                  id="any"
                  name="gender"
                  value=""
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="any"> Any</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaRegStar className="w-6 h-6 mr-2" /> Ratings
            </h3>
            <div>
              <Stack spacing={1}>
                <Rating
                  sx={{ color: "#035fe9" }}
                  onChange={(e) => handleChangeOptions(e)}
                  name="rating"
                  defaultValue={0}
                  precision={0.5}
                />
              </Stack>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaGlobeAmericas className="w-6 h-6 mr-2" /> Language and country
            </h3>
            <div className="flex flex-col space-y-2">
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={languageOptions}
                name="language"
                id="language"
                isMulti={true}
              />
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={countryOptions}
                name="country"
                id="country"
                isMulti={true}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaMoneyBill1Wave className="w-6 h-6 mr-2" /> Session fees
            </h3>
            <div className="px-4">
              <Box>
                <Slider
                  getAriaLabel={() => "Fees range"}
                  name="price"
                  value={value}
                  onChange={handleRenewSlider}
                  onChangeCommitted={handleChangeSlider}
                  valueLabelDisplay="auto"
                  getAriaValueText={(value) => `${value}`}
                  min={minFees}
                  max={maxFees}
                />
              </Box>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <button
              onClick={handleResetFilters}
              className="bg-white text-[#035fe9] py-2 w-full border border-[#035fe9] rounded-[10px] hover:text-[#022a67] hover:border-[#022a67]"
            >
              Reset Filters
            </button>
          </div>
        </aside>
      ) : (
        <aside className="fixed top-0 left-0 bg-white p-4 z-10 flex flex-col space-y-6 w-screen h-screen overflow-y-scroll">
          <div className="flex justify-end">
            <MdClose
              onClick={handleOpenModal}
              className="text-[#035fe9] cursor-pointer"
            />
          </div>
          <h2 className="text-[#035fe9] text-lg font-bold text-center">
            Filters
          </h2>
          <hr />
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <MdOutlineEventAvailable className="w-6 h-6 mr-2" /> Availability
            </h3>
            <div className="grid grid-cols-2 w-full">
              <div>
                <input
                  id="today"
                  name="todayDate"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? formatDate(today) : "",
                      },
                    })
                  }
                  value={formatDate(today)}
                  type="checkbox"
                />
                <label htmlFor="today"> Today</label>
              </div>
              <div>
                <input
                  id="this week"
                  name="thisWeek"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked
                          ? getWeekStartAndEnd(today)
                          : "",
                      },
                    })
                  }
                  value={getWeekStartAndEnd(today)}
                  type="checkbox"
                />
                <label htmlFor="this week"> This Week</label>
              </div>
              <div>
                <input
                  id="online"
                  name="isOnline"
                  onChange={(e) =>
                    handleChangeOptions({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? "true" : "",
                      },
                    })
                  }
                  value="true"
                  type="checkbox"
                />
                <label htmlFor="online"> Online</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <MdDateRange className="w-6 h-6 mr-2" /> Specific date or range
            </h3>
            <div onClick={handleOpen}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Choose a date"
                    sx={{ width: 1, borderRadius: 4 }}
                    open={open}
                    onChange={handleChangeDate}
                    closeOnSelect={true}
                    slots={{ openPickerIcon: EmptyIcon }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            {showRange2 ? (
              <div onClick={handleOpen2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Choose a date"
                      sx={{ width: 1, borderRadius: 4 }}
                      open={open2}
                      onChange={handleChangeDate2}
                      closeOnSelect={true}
                      slots={{ openPickerIcon: EmptyIcon }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <LuShapes className="w-6 h-6 mr-2" /> Areas of interest
            </h3>
            <div>
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={specializationOptions}
                name="speciality"
                id="speciality"
                isMulti={true}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <IoStopwatchOutline className="w-6 h-6 mr-2" /> Duration
            </h3>
            <div className="flex space-x-4">
              <div>
                <input
                  id="30mins"
                  name="30mins"
                  value="30mins"
                  type="checkbox"
                />
                <label htmlFor="30mins"> 30 mins</label>
              </div>
              <div>
                <input
                  id="60mins"
                  name="60mins"
                  value="60mins"
                  type="checkbox"
                />
                <label htmlFor="60mins"> 60 mins</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <IoMaleFemaleSharp className="w-6 h-6 mr-2" /> Doctor Gender
            </h3>
            <div className="flex space-x-4">
              <div>
                <input
                  id="male"
                  name="gender"
                  value="Male"
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="male"> Male</label>
              </div>
              <div>
                <input
                  id="female"
                  name="gender"
                  value="Female"
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="female"> Female</label>
              </div>
              <div>
                <input
                  id="any"
                  name="gender"
                  value=""
                  type="radio"
                  onChange={(e) => handleChangeOptions(e)}
                />
                <label htmlFor="any"> Any</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaRegStar className="w-6 h-6 mr-2" /> Ratings
            </h3>
            <div>
              <Stack spacing={1}>
                <Rating
                  sx={{ color: "#035fe9" }}
                  onChange={(e) => handleChangeOptions(e)}
                  name="rating"
                  defaultValue={0}
                  precision={0.5}
                />
              </Stack>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaGlobeAmericas className="w-6 h-6 mr-2" /> Language and country
            </h3>
            <div className="flex flex-col space-y-2">
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={languageOptions}
                name="language"
                id="language"
                isMulti={true}
              />
              <SortDropDown
                handleChangeFilter={handleChangeFilterDrop}
                options={countryOptions}
                name="country"
                id="country"
                isMulti={true}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="flex items-center text-md text-[#035fe9] font-semibold">
              <FaMoneyBill1Wave className="w-6 h-6 mr-2" /> Session fees
            </h3>
            <div className="px-4">
              <Box>
                <Slider
                  getAriaLabel={() => "Fees range"}
                  name="price"
                  value={value}
                  onChange={handleRenewSlider}
                  onChangeCommitted={handleChangeSlider}
                  valueLabelDisplay="auto"
                  getAriaValueText={(value) => `${value}`}
                  min={minFees}
                  max={maxFees}
                />
              </Box>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <button
              onClick={handleResetFilters}
              className="bg-white text-[#035fe9] py-2 w-full border border-[#035fe9] rounded-[10px] hover:text-[#022a67] hover:border-[#022a67]"
            >
              Reset Filters
            </button>
          </div>
        </aside>
      )}
    </>
  );
};

export default FilterComponent;
