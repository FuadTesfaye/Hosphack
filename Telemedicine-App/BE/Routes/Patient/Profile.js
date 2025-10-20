const express = require('express');
const patientProfileController = require('../../Controllers/Patient/Profile');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');

const router = express.Router();

router.get('/info', tokenAuthentication, patientProfileController.patientInfo);
router.get('/appointments', tokenAuthentication, patientProfileController.patientAppointments);
router.get('/doctors', tokenAuthentication, patientProfileController.patientDoctors);
router.get('/reviews', tokenAuthentication, patientProfileController.patientReviews);
router.get('/requests', tokenAuthentication, patientProfileController.patientViewRequests);

module.exports = router;    