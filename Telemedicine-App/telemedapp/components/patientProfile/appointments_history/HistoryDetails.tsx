import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { formatDate } from "../../../utils/date";
import stylesButton from "../../navbarComp/navbar.module.css";
import ReadMore from "../../common/ReadMore";
interface HistoryDetailsProps {
  appointment: any;
}

const HistoryDetails: React.FC<HistoryDetailsProps> = ({ appointment }) => {
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    setShowDialog(false);
  };

  const handleFollowUpClick = () => {
    setShowDialog(true);
  };

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointmentsDetails = async () => {
      if (appointment?.appointment_id) {
        setLoading(true);
        setError(null); // Reset error state
        const token = localStorage.getItem("jwt");

        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_SERVER_NAME
            }/patient/appointment/appointmentdetails/${Number(
              appointment.appointment_id,
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!response.ok)
            throw new Error("Failed to fetch appointment details");

          const data = await response.json();
          if (data && data.appointment) {
            setAppointmentDetails(data.appointment);
          } else {
            throw new Error("Invalid data structure");
          }
        } catch (error) {
          setError("Error fetching appointment details");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAppointmentsDetails();
  }, [showDialog]);

  return (
    <>
      <button
        className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white py-2 px-4 rounded-lg w-full`}
        onClick={handleFollowUpClick}
      >
        View Details
      </button>
      <Dialog
        className="bg-opacity-100 bg-gray-50 rounded-lg shadow-2xl"
        style={{
          width: "90vw",
          minHeight: "200px",
          maxWidth: "600px",
          padding: "1rem",
          zIndex: 1000,
        }}
        header="Appointment Details"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        footer={
          <button
            className={`${stylesButton.gradient_button} md:text-sm text-xs font-medium text-white mt-2 py-2 px-4 rounded-lg disabled:opacity-50`}
            onClick={handleBack}
          >
            Back
          </button>
        }
      >
        {loading ? (
          <p className="mt-4 text-center text-gray-500">
            Loading appointment details...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : appointmentDetails ? (
          <Card
            title={`Dr. ${appointmentDetails.doctor_first_name} ${appointmentDetails.doctor_last_name}`}
          >
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <strong>Specialization:</strong>{" "}
                {appointmentDetails.doctor_specialization}
              </div>
              <div>
                <strong>Appointment Type:</strong>{" "}
                {appointmentDetails.appointment_type}
              </div>
              <div>
                <strong>Date & Time:</strong>{" "}
                {appointmentDetails.doctor_availability_day_hour &&
                  formatDate(appointmentDetails.doctor_availability_day_hour)}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {appointmentDetails.appointment_duration} min
              </div>

              {/* Treatment Plan */}
              {appointmentDetails.treatmentPlan && (
                <div className="flex gap-2 flex-col">
                  <div>
                    <strong>Treatment Plan:</strong>{" "}
                    {appointmentDetails.treatmentPlan.treatment_plan_operations}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {appointmentDetails.appointment_status}
                  </div>
                  <div>
                    <strong>Complaint:</strong>{" "}
                    {appointmentDetails.appointment_complaint ? (
                      <ReadMore
                        text={appointmentDetails.appointment_complaint}
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              )}

              {/* Appointment Results */}
              {appointmentDetails.appointmentResults &&
                appointmentDetails.appointmentResults.length > 0 && (
                  <div>
                    <strong>Appointment Results:</strong>
                    {appointmentDetails.appointmentResults.map(
                      (result: any, index: number) => (
                        <p key={index}>
                          Diagnosis: {result.appointment_diagnosis} <br />
                          Report: {result.appointment_report} <br />
                        </p>
                      ),
                    )}
                  </div>
                )}

              {/* Medications */}
            </div>
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              {appointmentDetails.medications &&
                appointmentDetails.medications.length > 0 && (
                  <div>
                    <strong>Medications:</strong>
                    {appointmentDetails.medications.map(
                      (med: any, index: number) => (
                        <p key={index}>
                          {med.medication_name}: {med.medication_dosage} <br />
                          From {formatDate(med.medication_start_date)} to{" "}
                          {formatDate(med.medication_end_date)} <br />
                          Note: {med.medication_note}
                        </p>
                      ),
                    )}
                  </div>
                )}
            </div>
          </Card>
        ) : (
          <p className="mt-4 text-center text-gray-500">
            No appointment details available.
          </p>
        )}
      </Dialog>
    </>
  );
};

export default HistoryDetails;
