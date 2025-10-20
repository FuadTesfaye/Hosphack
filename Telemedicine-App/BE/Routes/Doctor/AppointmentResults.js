const express = require('express');
const router = express.Router();
const AppointmentResultSubmission  = require('../../Controllers/Doctor/Appointments/AppointmentResults');
//const { tokenAuthentication } = require('../../Middleware/User/Authentication');

// Route for submitting appointment result and treatment plan
router.post('/:appointmentId/submitresults', AppointmentResultSubmission.AppointmentResultSubmission);

module.exports = router;
