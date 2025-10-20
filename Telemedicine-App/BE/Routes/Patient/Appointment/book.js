const express = require('express');
const patientAppointmentBookController = require('../../../Controllers/Patient/Appointment/Book');
const patientGetAvailabilitiesController = require('../../../Controllers/Patient/Appointment/patientGetAvailabilities');
const patientGetAppointmentsHistoryController = require('../../../Controllers/Patient/Appointment/appointmentsHistory');
const pendingappointmrntsController = require('../../../Controllers/Patient/Appointment/pendingappointments');
const GetDetailsController = require('../../../Controllers/Patient/Appointment/appointmentDetails');
const patientsubmitReview = require('../../../Controllers/Patient/Appointment/SubmitReview');

const { tokenAuthentication } = require('../../../Middleware/User/Authentication');
const router = express.Router();


router.post('/book', tokenAuthentication, patientAppointmentBookController.bookAppointment);
router.get('/appointmentsHistory', tokenAuthentication, patientGetAppointmentsHistoryController.appointmentsHistory);
router.get('/pendingappointments', tokenAuthentication, pendingappointmrntsController.pendingappointments);

router.get('/Availabilities/:doctorId',tokenAuthentication, patientGetAvailabilitiesController.patientGetAvailabilities);
router.get('/appointmentdetails/:appointmentId', tokenAuthentication, GetDetailsController.AppointmentDetails);
router.post('/:appointment_id/review', patientsubmitReview.SubmitReview);

module.exports = router;