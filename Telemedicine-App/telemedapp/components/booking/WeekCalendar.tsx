import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

interface WeekCalendarProps {
  availableDates: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  }[];
  handleDateSelect: (date: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  }) => void;
  selectedDate: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  } | null;
  bookedDates: string[];
}
const WeekCalendar: React.FC<WeekCalendarProps> = ({
  availableDates,
  handleDateSelect,
  selectedDate,
  bookedDates,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datesWithSlots, setDatesWithSlots] = useState<
    { date: string; slots: { time: string; id: number; type: string }[] }[]
  >([]);

  useEffect(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    // Create a set of booked dates for quick lookup
    const bookedSet = new Set(bookedDates);

    const updatedDatesWithSlots = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayStr = format(day, "EEEE");
      const existingDate = availableDates.find((d) => d.date === dayStr);
      // console.log("existingDate: ", existingDate);

      // If there are existing slots, filter duplicates based on the 'time' property
      const uniqueSlots = existingDate
        ? Array.from(
            new Map(
              existingDate.slots.map((slot) => [slot.time, slot]),
            ).values(),
          ).filter((slot) => {
            // Check if the slot's time is booked
            const slotDateTime = `${dateStr} ${slot.time}`;
            return !bookedSet.has(slotDateTime); // Exclude booked slots
          })
        : [];
      // console.log("uniqueSlots: ", uniqueSlots);

      return {
        date: dateStr,
        slots: uniqueSlots.map((slot) => ({
          ...slot,
          id: slot.id,
          time: slot.time,
          type: slot.type,
        })),
      };
    });

    setDatesWithSlots(updatedDatesWithSlots);
  }, [currentDate, availableDates, bookedDates]);

  const handlePreviousWeek = () => setCurrentDate((prev) => addDays(prev, -7));
  const handleNextWeek = () => setCurrentDate((prev) => addDays(prev, 7));

  return (
    <div className="flex flex-col gap-2 mb-4 ">
      <div className="flex flex-row items-center mb-4 ">
        <h3 className="text-xs md:text-sm lg:text-lg font-bold">
          Select date:
        </h3>
        <div className="mx-auto flex justify-evenly items-center">
          <button
            onClick={handlePreviousWeek}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
          >
            {"<"}
          </button>
          <span className="xl:mx-2 mx-1 xl:text-xl md:text-base text-sm md:text-center text-right font-semibold lg:max-w-44 max-w-28 lg:w-44 w-28">
            {format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d")} -{" "}
            {format(endOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d")}
          </span>
          <button
            onClick={handleNextWeek}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-7 grid-cols-4 gap-2 md:text-sm text-xs ">
        {datesWithSlots.map((dateObj) => (
          <button
            key={dateObj.date}
            className={`p-3 rounded-lg ${
              selectedDate?.date === dateObj.date
                ? "bg-green-500 hover:bg-green-600 text-white"
                : dateObj.slots.length > 0
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-500"
            }`}
            onClick={() => handleDateSelect(dateObj)}
          >
            {format(new Date(dateObj.date), "EEE d")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
