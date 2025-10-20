import React from "react";

interface DateSelectorProps {
  selectedDate: { date: string; slots: string[] } | null;
  handleDateSelect: (date: string) => void;
  availableDates: { date: string; slots: string[] }[];
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  handleDateSelect,
  availableDates,
}) => (
  <div className="flex flex-col items-start gap-2 justify-between mb-4">
    <h3 className="text-xl font-semibold">Select date:</h3>
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {availableDates.map((date) => (
        <button
          key={date.date}
          onClick={() => handleDateSelect(date.date)}
          className={`px-4 py-2 rounded-lg ${
            selectedDate?.date === date.date
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {date.date}
        </button>
      ))}
    </div>
  </div>
);

export default DateSelector;
