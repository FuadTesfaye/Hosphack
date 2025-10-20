"use client";
import React from "react";
import { Dialog } from "primereact/dialog";

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  complaint?: string;
  setComplaint: (complaint: string) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading,
  complaint,
  setComplaint,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setComplaint("");
  };

  return (
    <Dialog
      visible={visible}
      className="bg-opacity-100 bg-gray-50 rounded-lg shadow-2xl"
      style={{
        width: "90vw",
        minHeight: "200px",
        maxWidth: "600px",
        padding: "1rem",
        zIndex: 1000,
      }}
      onHide={onCancel}
      draggable={false}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold text-start">
          Request Appointment
        </h2>
        <p className="my-6 text-center italic text-gray-600">
          Are you sure you want to send this appointment request?
        </p>
        <textarea
          value={complaint}
          onChange={(e) => {
            setComplaint(e.target.value);
          }}
          placeholder="Patient's complaint goes here..."
          className="  rounded border p-4"
        />

        <div className="flex justify-end h-[100px] items-end">
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              disabled={loading || complaint === ""}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Request"}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className=" py-3 px-6 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-800 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
