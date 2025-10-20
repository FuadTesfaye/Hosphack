import React from "react";
import Image from "next/image";
import { formatDate } from "@/utils/date";

const PrescriptionCard = ({
  prescription,
  handlePrescriptionModal,
}: {
  prescription: any;
  handlePrescriptionModal: any;
}) => {
  return (
    <div
      onClick={() => handlePrescriptionModal(prescription.id)}
      className="bg-gray-100 rounded-3xl p-4 cursor-pointer flex flex-col space-y-4 overflow-y-auto shadow-lg hover:scale-105 transition"
    >
      <div className="flex flex-col justify-between items-center">
        <Image
          width={1080}
          height={1080}
          className="w-16 h-16 rounded-full object-cover"
          src={prescription.doctorImage}
          alt="doc"
        />
        <p className="">{prescription.doctorName}</p>
        <p className="text-[#035fe9]">{prescription.specialty}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[#035fe9]">
          {" "}
          Visit Date:{" "}
          <span className="text-black">
            {formatDate(prescription.visitDate)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PrescriptionCard;
