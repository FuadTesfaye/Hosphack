const express = require("express");
const doctorProfileController = require("../../Controllers/Doctor/Profile");
const { tokenAuthentication } = require("../../Middleware/User/Authentication");

const router = express.Router();

router.get("/info", tokenAuthentication, doctorProfileController.doctorInfo);
router.get(
  "/patients",
  tokenAuthentication,
  doctorProfileController.doctorPatients
);
router.get(
  "/appointments",
  tokenAuthentication,
  doctorProfileController.doctorAppointments
);
// router.get('/availabilities', tokenAuthentication, doctorProfileController.doctorAvailabilities);
router.get(
  "/DoctorFurtherInformation",
  tokenAuthentication,
  doctorProfileController.doctor_Further_Informtion
);
// router.get('/experience', tokenAuthentication, doctorProfileController.doctorExperience);
// router.get('/education', tokenAuthentication, doctorProfileController.doctorEducation);
// router.get('/interests', tokenAuthentication, doctorProfileController.doctorInterests);
router.get(
  "/reviews",
  tokenAuthentication,
  doctorProfileController.doctorReviews
);
router.get(
  "/PendingRequests",
  tokenAuthentication,
  doctorProfileController.doctorPendingRequests
);
router.get(
  "/DeclinedRequests",
  tokenAuthentication,
  doctorProfileController.doctorDeclinedRequests
);

router.post("/experience", tokenAuthentication, doctorProfileController.addDoctorExperience);
router.post("/education", tokenAuthentication, doctorProfileController.addDoctorEducation);
router.post("/languages", tokenAuthentication, doctorProfileController.addDoctorLanguage);
router.post("/interests", tokenAuthentication, doctorProfileController.addDoctorInterest);

// Delete routes
router.delete("/experience/:doctor_experience_id", tokenAuthentication, doctorProfileController.deleteDoctorExperience);
router.delete("/education/:doctor_education_id", tokenAuthentication, doctorProfileController.deleteDoctorEducation);
router.delete("/languages/:language_id", tokenAuthentication, doctorProfileController.deleteDoctorLanguage);
router.delete("/interests/:doctor_interest_id", tokenAuthentication, doctorProfileController.deleteDoctorInterest);

module.exports = router;
