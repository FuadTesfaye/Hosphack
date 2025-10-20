const express = require('express');
const router = express.Router();
const AppointmentHistory  = require('../../Controllers/Doctor/Appointments/AppointmentsHistory');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');

// Route for submitting appointment result and treatment plan
router.get('',tokenAuthentication, AppointmentHistory.appointmentsHistory);

module.exports = router;
