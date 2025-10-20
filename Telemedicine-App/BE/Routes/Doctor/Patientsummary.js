const express = require('express');
const router = express.Router();
const doctorPatientSummaryController  = require('../../Controllers/Doctor/Appointments/Patientsummary');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');

// Route for submitting appointment result and treatment plan
router.get('/:patientId',tokenAuthentication, doctorPatientSummaryController.getPatientSummary);

module.exports = router;