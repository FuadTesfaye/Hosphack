"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";

const AddAppointmentResult = () => {
  const { appointmentId } = useParams();
  const [openModalAdd, setOpenModalAdd] = useState(true);
  const [finalMedication, setFinalMedication] = useState<any[]>([]);
  const [diagnosisData, setDiagnosisData] = useState({
    diagnosis: "",
    operations: "",
    report: "",
    specialityReferral: "",
    specialityReferralNotes: "",
  });
  const [currentMedication, setCurrentMedication] = useState({
    dose: "",
    drugName: "",
    endDate: "",
    note: "",
    startDate: "",
  });
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctor/appointmentDetails/${appointmentId}`,
      {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    )
      .then((response) => response.json())
      .then((response) =>
        setDoctorId(() => response.appointment.appointment_doctor_id),
      );
  }, [prescriptionUploaded]);

  const handleChangeDiagnosis = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDiagnosisData((prevDiagnosis) => ({
      ...prevDiagnosis,
      [name]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentMedication((prevMedication) => ({
      ...prevMedication,
      [name]: value,
    }));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const { drugName, dose, startDate, endDate, note } = currentMedication;

    if (!drugName || !dose || !startDate || !endDate) {
      alert(
        "Please fill in all required fields (Drug Name, Dose, Start Date, End Date)",
      );
      return;
    }

    if (finalMedication.length === 0) {
      setFinalMedication(() => [{ ...currentMedication }]);
    } else {
      setFinalMedication((prevMedication) => [
        ...prevMedication,
        { ...currentMedication },
      ]);
    }

    setCurrentMedication({
      dose: "",
      drugName: "",
      endDate: "",
      note: "",
      startDate: "",
    });
  };

  const handleUploadPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosisData.diagnosis) {
      alert("Please Add Diagnosis Before Uploading!");
      return;
    }
    if (!diagnosisData.operations) {
      alert("Please Add Operations Before Uploading!");
      return;
    }
    if (!diagnosisData.report) {
      alert("Please Add Report Before Uploading!");
      return;
    }
    if (finalMedication.length === 0) {
      alert("Please Add At Least One Medication Before Uploading!");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctor/AppointmentResults/${appointmentId}/submitresults`,
        {
          headers: headers,
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            appointment_id: appointmentId,
            diagnosis: diagnosisData.diagnosis,
            operations: diagnosisData.operations,
            report: diagnosisData.report,
            specialityReferral: diagnosisData.specialityReferral,
            specialityReferralNotes: diagnosisData.specialityReferralNotes,
            medications: finalMedication,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to upload prescription");
      }
      const data = await response.json();
      console.log("Prescription uploaded successfully:", data);
      setPrescriptionUploaded(() => true);
      setFinalMedication([]);
      setCurrentMedication({
        dose: "",
        drugName: "",
        endDate: "",
        note: "",
        startDate: "",
      });
      //setOpenModalAdd(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <FaPlus
        onClick={() => setOpenModalAdd(true)}
        className="z-10 fixed bottom-[3%] right-[3%] rounded-full w-14 h-14 bg-[#035fe9] p-4 cursor-pointer text-white shadow-md shadow-gray-600 hover:scale-110 transition"
      />
      {openModalAdd && (
        <aside className="fixed inset-0 flex justify-center items-center z-10">
          <div
            onClick={() => setOpenModalAdd(false)}
            className="fixed inset-0 bg-black opacity-50"
          ></div>
          <div className="bg-white flex flex-col space-y-6 w-[80%] h-[80%] md:w-[60%] lg:w-[50%] overflow-y-auto rounded-2xl z-20">
            <div className="flex justify-center items-center sticky top-0 bg-white z-2 p-2 border-b-[1px] border-[#035fe9]">
              <div className="text-[#035fe9] font-bold text-xl text-center">
                Add a Prescription
              </div>
            </div>
            <div className="grow flex flex-col space-y-4 px-4 overflow-x-auto">
              {prescriptionUploaded ? (
                <div className="flex flex-col gap-7 justify-center items-center h-full pb-16">
                  <p className="text-center font-semibold text-xl">
                    Does This Patient Need A Follow Up Appointment?
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href={`/doctors/${doctorId}`}>
                      <button className="bg-teal-500 rounded-xl p-3 font-semibold text-white hover:bg-teal-800 transition-colors w-48">
                        Schedule A Follow Up
                      </button>
                    </Link>
                    <Link href="/doctorProfile/appointments">
                      <button className="bg-stone-400 rounded-xl p-3 font-semibold text-white hover:bg-stone-500 transition-colors w-48">
                        Skip
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form>
                  <h4 className="font-semibold mb-2">Add Diagnosis</h4>
                  <div className="mb-2">
                    <label htmlFor="diagnosis" className="block font-medium">
                      Diagnosis<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="diagnosis"
                      onChange={handleChangeDiagnosis}
                      name="diagnosis"
                      value={diagnosisData.diagnosis}
                      type="text"
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="operations" className="block font-medium">
                      Operations<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="operations"
                      onChange={handleChangeDiagnosis}
                      name="operations"
                      value={diagnosisData.operations}
                      type="text"
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="report" className="block font-medium">
                      Report<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="report"
                      onChange={handleChangeDiagnosis}
                      name="report"
                      value={diagnosisData.report}
                      type="text"
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="specialityReferral"
                      className="block font-medium"
                    >
                      Speciality Referral
                    </label>
                    <input
                      id="specialityReferral"
                      onChange={handleChangeDiagnosis}
                      name="specialityReferral"
                      value={diagnosisData.specialityReferral}
                      type="text"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="specialityReferralNotes"
                      className="block font-medium"
                    >
                      Speciality Referral Notes
                    </label>
                    <input
                      id="specialityReferralNotes"
                      onChange={handleChangeDiagnosis}
                      name="specialityReferralNotes"
                      value={diagnosisData.specialityReferralNotes}
                      type="text"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </form>
              )}
              {prescriptionUploaded ? (
                <></>
              ) : (
                <form
                  onSubmit={handleAddMedication}
                  className="flex flex-col space-y-4"
                >
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Add Medication</h4>
                    <div className="mb-2">
                      <label htmlFor="name" className="block font-medium">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        onChange={handleChange}
                        name="drugName"
                        value={currentMedication.drugName}
                        type="text"
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="dose" className="block font-medium">
                        Dose<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="dose"
                        onChange={handleChange}
                        name="dose"
                        value={currentMedication.dose}
                        type="text"
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="start" className="block font-medium">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="start"
                        onChange={handleChange}
                        name="startDate"
                        value={currentMedication.startDate}
                        type="date"
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="end" className="block font-medium">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="end"
                        onChange={handleChange}
                        name="endDate"
                        value={currentMedication.endDate}
                        type="date"
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="notes" className="block font-medium">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        onChange={handleChange}
                        name="note"
                        value={currentMedication.note}
                        className="w-full border p-2 rounded"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-white rounded-full px-4 py-2 bg-[#035fe9] flex items-center space-x-2 hover:scale-105 transition"
                    >
                      <FaPlus /> <span>Add Medication</span>
                    </button>
                  </div>
                </form>
              )}

              {finalMedication.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg mb-2">
                    Added Medications
                  </h4>
                  <ul className="list-disc list-inside space-y-4">
                    {finalMedication.map((med, index) => (
                      <li key={index}>
                        <strong>{med.drugName}</strong> - {med.dose},{" "}
                        {med.startDate} to {med.endDate}
                        {med.note && `, Notes: ${med.note}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {prescriptionUploaded ? (
              <></>
            ) : (
              <div className="flex justify-around space-x-4">
                <button
                  onClick={handleUploadPrescription}
                  className="text-white rounded-full px-4 py-2 bg-[#035fe9] flex items-center space-x-2 m-4 hover:scale-105 transition"
                >
                  <FaUpload /> <span>Upload Result</span>
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to discard the current result?",
                      )
                    ) {
                      setOpenModalAdd(false);
                      setFinalMedication([]);
                      setCurrentMedication({
                        dose: "",
                        drugName: "",
                        endDate: "",
                        note: "",
                        startDate: "",
                      });
                    }
                  }}
                  className="text-gray-700 rounded-full px-4 py-2 bg-gray-200 flex items-center space-x-2 m-4 hover:scale-105 transition"
                >
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      )}
    </section>
  );
};

export default AddAppointmentResult;
