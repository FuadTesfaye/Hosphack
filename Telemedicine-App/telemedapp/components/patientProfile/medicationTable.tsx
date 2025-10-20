import React from "react";
import { formatDateString } from "@/utils/date";

const MedicationTable = ({ medicationList }: { medicationList: any[] }) => {
  return (
    <table className="border w-full text-xs md:text-base lg:text-lg">
      <thead>
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Dosage</th>
          <th className="p-2">Start Date</th>
          <th className="p-2">End Date</th>
          <th className="p-2">Doctor's Notes</th>
        </tr>
      </thead>
      <tbody className="border">
        {medicationList.map((medication) => (
          <tr className="border text-center" key={medication.medication_id}>
            <td className="border p-2">{medication.medication_name}</td>
            <td className="border p-2">{medication.medication_dosage}</td>
            <td className="border p-2">
              {formatDateString(medication.medication_start_date)}
            </td>
            <td className="border p-2">
              {formatDateString(medication.medication_end_date)}
            </td>
            <td className="border p-2">{medication.medication_note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicationTable;
