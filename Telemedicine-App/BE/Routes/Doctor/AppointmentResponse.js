const express = require('express');
const AppointmentResponseController = require('../../Controllers/Doctor/Appointments/AppointmentResponse');
const { tokenAuthentication } = require('../../Middleware/User/Authentication');
const router = express.Router();


router.post('/:appointmentId/:patientId/:response', tokenAuthentication, AppointmentResponseController.doctorAppointmentResponse);

module.exports = router;