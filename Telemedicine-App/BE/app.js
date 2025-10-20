const express = require("express");
const cors = require("cors");
const userLoginRoute = require("./Routes/Login");
const userLogoutRoute = require("./Routes/Logout");
const patientRegisterRoute = require("./Routes/Patient/Register");
const doctorRegisterRoute = require("./Routes/Doctor/Register");
const patienProfileRoute = require("./Routes/Patient/Profile");
const patientEditRoute = require("./Routes/Patient/Edit");
const patientAppointmentBookRoute = require("./Routes/Patient/Appointment/book");
const patientSubmitReviewRoute = require("./Routes/Patient/Appointment/SubmitReview");
const patientHomeRoute = require("./Routes/Patient/Home");
const backOfficeRoute = require("./Routes/backOffice/backOfficeRoutes");
// const patientAddPrescriptionRoute = require('./Routes/Patient/MedicalHistory/addPrescription');
// const patientDeletePrescriptionRoute= require('./Routes/Patient/MedicalHistory/deletePrescription');
// const patientViewPrescriptionRoute= require('./Routes/Patient/MedicalHistory/viewPrescription');
const patientUploadMedicalDocumentRoute = require("./Routes/Patient/Medical Document/Upload");
const patientViewMedicalDocumentRoute = require("./Routes/Patient/Medical Document/View");
const patientDeleteMedicalDocumentRoute = require("./Routes/Patient/Medical Document/Delete");
const doctorProfileRoute = require("./Routes/Doctor/Profile");
const doctorEditRoute = require("./Routes/Doctor/Edit");
// const doctorAddAvailabilityRoute = require('./Routes/Doctor/Availability/add');
// const doctorDeleteAvailabilityRoute = require('./Routes/Doctor/Availability/Delete');
const doctorProfilePictureUploadRoute = require("./Routes/Doctor/Profile Picture/Upload");
// const doctorPatientPrescriptionAddRoute = require('./Routes/Doctor/Patient Prescription/Add');
const doctorAppointmentResponseAddRoute = require("./Routes/Doctor/AppointmentResponse");
const doctorFollowUpAppointmentAddRoute = require("./Routes/Doctor/BookFollowUp");
const doctorAppointmentResultsAddRoute = require("./Routes/Doctor/AppointmentResults");
const doctorAppointmentHistoryRoute = require("./Routes/Doctor/AppointmentHistory");
const doctorAppointmentDetailsRoute = require("./Routes/Doctor/AppointmentDetails");
const doctorPatientsummaryRoute = require("./Routes/Doctor/Patientsummary");
const doctorAvailabilityRoute = require("./Routes/Doctor/Availability");
const notificationsRoute = require("./Routes/notifications");
const emailRoute = require("./Routes/Email");

const chatRoute = require("./Routes/Chat");
const { globalErrorHanlder } = require("./Utilities");
const port = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/login", userLoginRoute);
app.use("/logout", userLogoutRoute);
app.use("/patient/register", patientRegisterRoute);
app.use("/doctor/register", doctorRegisterRoute);
app.use("/patient/profile", patienProfileRoute);
app.use("/patient/edit", patientEditRoute);
app.use("/patient/appointment", patientAppointmentBookRoute); 
// app.use("/patient/appointment", patientSubmitReviewRoute);doblecated end piont moved to patientAppointmentBookRoute
app.use("/patient/home", patientHomeRoute);
// app.use('/patient/prescription/add',patientAddPrescriptionRoute);
// app.use('/patient/prescription/view',patientViewPrescriptionRoute);
// app.use('/patient/prescription/delete',patientDeletePrescriptionRoute);
app.use("/patient/medical-document/upload", patientUploadMedicalDocumentRoute);
app.use("/patient/medical-document/view", patientViewMedicalDocumentRoute);
app.use("/patient/medical-document/delete", patientDeleteMedicalDocumentRoute);
app.use("/doctor/edit", doctorEditRoute);
app.use("/doctor/profile", doctorProfileRoute);
app.use("/doctor/availability", doctorAvailabilityRoute);
// app.use('/doctor/availability/delete', doctorDeleteAvailabilityRoute);
app.use("/doctor/profile-picture/upload", doctorProfilePictureUploadRoute);
// app.use('/doctor/patient-prescription/add', doctorPatientPrescriptionAddRoute);
app.use("/doctor/AppointmentResponse", doctorAppointmentResponseAddRoute);
app.use("/doctor/BookFollowUp", doctorFollowUpAppointmentAddRoute);
app.use("/doctor/AppointmentResults", doctorAppointmentResultsAddRoute);
app.use("/doctor/appointmentHistory", doctorAppointmentHistoryRoute);
app.use("/doctor/appointmentDetails", doctorAppointmentDetailsRoute);
app.use("/doctor/PatientSummary", doctorPatientsummaryRoute);
app.use("/appointment-chat", chatRoute);
app.use("/notifications", notificationsRoute);
app.use("/email-service", emailRoute);

/// backOffice
app.use("/backOffice", backOfficeRoute);
app.use("/", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    ok: false,
    message: "No such route founded in server...💣💣💣",
  });
});

app.use(globalErrorHanlder);

app.listen(port, (error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
